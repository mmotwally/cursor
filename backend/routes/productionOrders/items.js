import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';
import { logAuditTrail } from '../../utils/audit.js';

const router = express.Router();

router.use(authenticateToken);

// Add production order item
router.post('/:productionOrderId/items', async (req, res) => {
  try {
    const { item_id, quantity, unit_id } = req.body;
    const productionOrderId = req.params.productionOrderId;
    if (!item_id || !quantity || !unit_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await runStatement(`
      INSERT INTO production_order_items (production_order_id, item_id, quantity, unit_id)
      VALUES (?, ?, ?, ?)
    `, [productionOrderId, item_id, quantity, unit_id]);
    await logAuditTrail('production_order_items', result.id, 'INSERT', null, req.body, req.user.id);
    res.status(201).json({ id: result.id, message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding production order item:', error);
    res.status(500).json({ error: 'Failed to add production order item' });
  }
});

// Update production order item
router.put('/:productionOrderId/items/:itemId', async (req, res) => {
  try {
    const { quantity, unit_id } = req.body;
    const { productionOrderId, itemId } = req.params;
    const currentItems = await runQuery('SELECT * FROM production_order_items WHERE id = ?', [itemId]);
    if (currentItems.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await runStatement(`
      UPDATE production_order_items SET quantity = ?, unit_id = ? WHERE id = ?
    `, [quantity, unit_id, itemId]);
    await logAuditTrail('production_order_items', itemId, 'UPDATE', currentItems[0], req.body, req.user.id);
    res.json({ id: itemId, message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating production order item:', error);
    res.status(500).json({ error: 'Failed to update production order item' });
  }
});

// Delete production order item
router.delete('/:productionOrderId/items/:itemId', async (req, res) => {
  try {
    const { productionOrderId, itemId } = req.params;
    const currentItems = await runQuery('SELECT * FROM production_order_items WHERE id = ?', [itemId]);
    if (currentItems.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await runStatement('DELETE FROM production_order_items WHERE id = ?', [itemId]);
    await logAuditTrail('production_order_items', itemId, 'DELETE', currentItems[0], null, req.user.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting production order item:', error);
    res.status(500).json({ error: 'Failed to delete production order item' });
  }
});

export default router; 