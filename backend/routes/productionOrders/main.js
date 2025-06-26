import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';
import { logAuditTrail } from '../../utils/audit.js';

const router = express.Router();

router.use(authenticateToken);

// Get all production orders with filters
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    let sql = `
      SELECT 
        p.*,
        u.username as created_by_name,
        b.name as bom_name,
        COUNT(DISTINCT poi.id) as material_count,
        COUNT(DISTINCT po.id) as operation_count
      FROM production_orders p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN bill_of_materials b ON p.bom_id = b.id
      LEFT JOIN production_order_items poi ON p.id = poi.production_order_id
      LEFT JOIN production_order_operations po ON p.id = po.production_order_id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      sql += ` AND p.status = ?`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (p.order_number LIKE ? OR p.title LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += ` GROUP BY p.id ORDER BY p.created_at DESC`;
    const offset = (page - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    const productionOrders = await runQuery(sql, params);
    let countSql = `SELECT COUNT(DISTINCT p.id) as total FROM production_orders p WHERE 1=1`;
    const countParams = [];
    if (status) {
      countSql += ` AND p.status = ?`;
      countParams.push(status);
    }
    if (search) {
      countSql += ` AND (p.order_number LIKE ? OR p.title LIKE ? OR p.description LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const countResult = await runQuery(countSql, countParams);
    const total = countResult[0].total;
    res.json({
      productionOrders: productionOrders || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total || 0,
        pages: Math.ceil((total || 0) / parseInt(limit))
      }
    });
  } catch (error)  {
    console.error('Error fetching production orders:', error);
    res.status(500).json({ error: 'Failed to fetch production orders' });
  }
});

// Get single production order with details
router.get('/:id', async (req, res) => {
  try {
    const productionOrderId = req.params.id;
    const orders = await runQuery(`
      SELECT 
        p.*,
        u.username as created_by_name,
        b.name as bom_name,
        b.version as bom_version
      FROM production_orders p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN bill_of_materials b ON p.bom_id = b.id
      WHERE p.id = ?
    `, [productionOrderId]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Production order not found' });
    }
    const order = orders[0];
    res.json(order);
  } catch (error) {
    console.error('Error fetching production order details:', error);
    res.status(500).json({ error: 'Failed to fetch production order details' });
  }
});

// Create new production order
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      bom_id,
      quantity,
      priority,
      start_date,
      due_date,
      notes
    } = req.body;
    if (!title || !bom_id || !quantity) {
      return res.status(400).json({ error: 'Title, BOM, and quantity are required' });
    }
    const result = await runStatement(`
      INSERT INTO production_orders (
        title, description, bom_id, quantity, priority, start_date, due_date, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || '',
      bom_id,
      quantity,
      priority || 'normal',
      start_date || null,
      due_date || null,
      notes || '',
      req.user.id
    ]);
    await logAuditTrail('production_orders', result.id, 'INSERT', null, req.body, req.user.id);
    res.status(201).json({ id: result.id, message: 'Production order created successfully' });
  } catch (error) {
    console.error('Error creating production order:', error);
    res.status(500).json({ error: 'Failed to create production order' });
  }
});

// Update production order
router.put('/:id', async (req, res) => {
  try {
    const productionOrderId = req.params.id;
    const {
      title,
      description,
      bom_id,
      quantity,
      priority,
      start_date,
      due_date,
      notes
    } = req.body;
    const currentOrders = await runQuery('SELECT * FROM production_orders WHERE id = ?', [productionOrderId]);
    if (currentOrders.length === 0) {
      return res.status(404).json({ error: 'Production order not found' });
    }
    await runStatement(`
      UPDATE production_orders SET
        title = ?, description = ?, bom_id = ?, quantity = ?, priority = ?, start_date = ?, due_date = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title,
      description || '',
      bom_id,
      quantity,
      priority || 'normal',
      start_date || null,
      due_date || null,
      notes || '',
      productionOrderId
    ]);
    await logAuditTrail('production_orders', productionOrderId, 'UPDATE', currentOrders[0], req.body, req.user.id);
    res.json({ id: productionOrderId, message: 'Production order updated successfully' });
  } catch (error) {
    console.error('Error updating production order:', error);
    res.status(500).json({ error: 'Failed to update production order' });
  }
});

// Delete production order
router.delete('/:id', async (req, res) => {
  try {
    const productionOrderId = req.params.id;
    const currentOrders = await runQuery('SELECT * FROM production_orders WHERE id = ?', [productionOrderId]);
    if (currentOrders.length === 0) {
      return res.status(404).json({ error: 'Production order not found' });
    }
    await runStatement('DELETE FROM production_orders WHERE id = ?', [productionOrderId]);
    await logAuditTrail('production_orders', productionOrderId, 'DELETE', currentOrders[0], null, req.user.id);
    res.json({ message: 'Production order deleted successfully' });
  } catch (error) {
    console.error('Error deleting production order:', error);
    res.status(500).json({ error: 'Failed to delete production order' });
  }
});

export default router; 