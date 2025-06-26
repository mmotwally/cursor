import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';
import { logAuditTrail } from '../../utils/audit.js';

const router = express.Router();

router.use(authenticateToken);

// Get all BOMs with summary information
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    let sql = `
      SELECT 
        b.*,
        u.username as created_by_name,
        i.name as finished_product_name,
        i.sku as finished_product_sku,
        COUNT(DISTINCT bc.id) as component_count,
        COUNT(DISTINCT bo.id) as operation_count
      FROM bill_of_materials b
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN inventory_items i ON b.finished_product_id = i.id
      LEFT JOIN bom_components bc ON b.id = bc.bom_id
      LEFT JOIN bom_operations bo ON b.id = bo.bom_id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      sql += ` AND b.status = ?`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (b.name LIKE ? OR b.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ` GROUP BY b.id ORDER BY b.updated_at DESC`;
    const offset = (page - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    const boms = await runQuery(sql, params);
    let countSql = `SELECT COUNT(DISTINCT b.id) as total FROM bill_of_materials b WHERE 1=1`;
    const countParams = [];
    if (status) {
      countSql += ` AND b.status = ?`;
      countParams.push(status);
    }
    if (search) {
      countSql += ` AND (b.name LIKE ? OR b.description LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const countResult = await runQuery(countSql, countParams);
    const total = countResult[0].total;
    res.json({
      boms: boms || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total || 0,
        pages: Math.ceil((total || 0) / parseInt(limit))
      }
    });
  } catch (error)  {
    console.error('Error fetching BOMs:', error);
    res.status(500).json({ error: 'Failed to fetch BOMs' });
  }
});

// Get single BOM with components and operations
router.get('/:id', async (req, res) => {
  try {
    const bomId = req.params.id;
    const boms = await runQuery(`
      SELECT 
        b.*,
        u.username as created_by_name,
        i.name as finished_product_name,
        i.sku as finished_product_sku
      FROM bill_of_materials b
      LEFT JOIN users u ON b.created_by = u.id
      LEFT JOIN inventory_items i ON b.finished_product_id = i.id
      WHERE b.id = ?
    `, [bomId]);
    if (boms.length === 0) {
      return res.status(404).json({ error: 'BOM not found' });
    }
    const bom = boms[0];
    res.json(bom);
  } catch (error) {
    console.error('Error fetching BOM details:', error);
    res.status(500).json({ error: 'Failed to fetch BOM details' });
  }
});

// Create new BOM
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      finished_product_id,
      version,
      status,
      unit_cost,
      labor_cost,
      overhead_cost,
      total_cost
    } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const result = await runStatement(`
      INSERT INTO bill_of_materials (
        name, description, finished_product_id, version, status,
        unit_cost, labor_cost, overhead_cost, total_cost, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      description || '',
      finished_product_id || null,
      version || '1.0',
      status || 'draft',
      unit_cost || 0,
      labor_cost || 0,
      overhead_cost || 0,
      total_cost || 0,
      req.user.id
    ]);
    await logAuditTrail('bill_of_materials', result.id, 'INSERT', null, req.body, req.user.id);
    res.status(201).json({ id: result.id, message: 'BOM created successfully' });
  } catch (error) {
    console.error('Error creating BOM:', error);
    res.status(500).json({ error: 'Failed to create BOM' });
  }
});

// Update BOM
router.put('/:id', async (req, res) => {
  try {
    const bomId = req.params.id;
    const {
      name,
      description,
      finished_product_id,
      version,
      status,
      unit_cost,
      labor_cost,
      overhead_cost,
      total_cost
    } = req.body;
    const currentBOMs = await runQuery('SELECT * FROM bill_of_materials WHERE id = ?', [bomId]);
    if (currentBOMs.length === 0) {
      return res.status(404).json({ error: 'BOM not found' });
    }
    await runStatement(`
      UPDATE bill_of_materials SET
        name = ?, description = ?, finished_product_id = ?, version = ?, status = ?,
        unit_cost = ?, labor_cost = ?, overhead_cost = ?, total_cost = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name,
      description || '',
      finished_product_id || null,
      version || '1.0',
      status || 'draft',
      unit_cost || 0,
      labor_cost || 0,
      overhead_cost || 0,
      total_cost || 0,
      bomId
    ]);
    await logAuditTrail('bill_of_materials', bomId, 'UPDATE', currentBOMs[0], req.body, req.user.id);
    res.json({ id: bomId, message: 'BOM updated successfully' });
  } catch (error) {
    console.error('Error updating BOM:', error);
    res.status(500).json({ error: 'Failed to update BOM' });
  }
});

// Delete BOM
router.delete('/:id', async (req, res) => {
  try {
    const bomId = req.params.id;
    const currentBOMs = await runQuery('SELECT * FROM bill_of_materials WHERE id = ?', [bomId]);
    if (currentBOMs.length === 0) {
      return res.status(404).json({ error: 'BOM not found' });
    }
    await runStatement('DELETE FROM bill_of_materials WHERE id = ?', [bomId]);
    await logAuditTrail('bill_of_materials', bomId, 'DELETE', currentBOMs[0], null, req.user.id);
    res.json({ message: 'BOM deleted successfully' });
  } catch (error) {
    console.error('Error deleting BOM:', error);
    res.status(500).json({ error: 'Failed to delete BOM' });
  }
});

export default router; 