import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { checkPermission } from '../../middleware/auth.js';
import { logAuditTrail } from '../../utils/audit.js';

const router = express.Router();

// Stock adjustment endpoint
router.post('/adjust-stock', checkPermission('inventory.adjust_stock'), async (req, res) => {
  try {
    const { item_id, adjustment_type, quantity, reason } = req.body;
    if (!item_id || !adjustment_type || !quantity || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const items = await runQuery('SELECT * FROM inventory_items WHERE id = ?', [item_id]);
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    const item = items[0];
    const currentQuantity = item.quantity;
    let newQuantity;
    if (adjustment_type === 'add') {
      newQuantity = currentQuantity + quantity;
    } else if (adjustment_type === 'subtract') {
      newQuantity = currentQuantity - quantity;
    } else {
      return res.status(400).json({ error: 'Invalid adjustment type' });
    }
    await runStatement(`
      UPDATE inventory_items 
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newQuantity, item_id]);
    await runStatement(`
      INSERT INTO stock_movements (
        item_id, movement_type, quantity, reference_type, 
        reference_id, reference_number, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      item_id, 
      adjustment_type === 'add' ? 'in' : 'out', 
      quantity, 
      'adjustment', 
      item_id, 
      `ADJ-${Date.now()}`,
      reason,
      req.user.id
    ]);
    await logAuditTrail('inventory_items', item_id, 'UPDATE', 
      { quantity: currentQuantity }, 
      { quantity: newQuantity, adjustment_reason: reason }, 
      req.user.id
    );
    if (req.app.get('io')) {
      req.app.get('io').to('inventory_updates').emit('item_updated', {
        id: item_id,
        quantity: newQuantity
      });
    }
    res.json({ 
      message: 'Stock adjusted successfully',
      new_quantity: newQuantity
    });
  } catch (error) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

// Get stock movements
router.get('/stock-movements', checkPermission('inventory.view_stock_movements'), async (req, res) => {
  try {
    const { itemId, startDate, endDate, movementType, page = 1, limit = 50 } = req.query;
    let sql = `
      SELECT sm.*, i.name as item_name, i.sku, u.name as unit_name
      FROM stock_movements sm
      LEFT JOIN inventory_items i ON sm.item_id = i.id
      LEFT JOIN units u ON i.unit_id = u.id
      WHERE 1=1
    `;
    const params = [];
    if (itemId) {
      sql += ' AND sm.item_id = ?';
      params.push(itemId);
    }
    if (movementType) {
      sql += ' AND sm.movement_type = ?';
      params.push(movementType);
    }
    if (startDate) {
      sql += ' AND sm.created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND sm.created_at <= ?';
      params.push(endDate);
    }
    sql += ' ORDER BY sm.created_at DESC';
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    const movements = await runQuery(sql, params);
    let countSql = 'SELECT COUNT(*) as total FROM stock_movements sm WHERE 1=1';
    const countParams = [];
    if (itemId) {
      countSql += ' AND sm.item_id = ?';
      countParams.push(itemId);
    }
    if (movementType) {
      countSql += ' AND sm.movement_type = ?';
      countParams.push(movementType);
    }
    if (startDate) {
      countSql += ' AND sm.created_at >= ?';
      countParams.push(startDate);
    }
    if (endDate) {
      countSql += ' AND sm.created_at <= ?';
      countParams.push(endDate);
    }
    const countResult = await runQuery(countSql, countParams);
    const total = countResult[0].total;
    res.json({
      movements: movements || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total || 0,
        pages: Math.ceil((total || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    res.status(500).json({ error: 'Failed to fetch stock movements' });
  }
});

export default router; 