import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';
import { logAuditTrail } from '../../utils/audit.js';

const router = express.Router();

router.use(authenticateToken);

// Add production order operation
router.post('/:productionOrderId/operations', async (req, res) => {
  try {
    const { name, description, sequence_number, assigned_to, estimated_time_minutes, labor_rate } = req.body;
    const productionOrderId = req.params.productionOrderId;
    if (!name || !sequence_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await runStatement(`
      INSERT INTO production_order_operations (production_order_id, name, description, sequence_number, assigned_to, estimated_time_minutes, labor_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [productionOrderId, name, description || '', sequence_number, assigned_to || null, estimated_time_minutes || 0, labor_rate || 0]);
    await logAuditTrail('production_order_operations', result.id, 'INSERT', null, req.body, req.user.id);
    res.status(201).json({ id: result.id, message: 'Operation added successfully' });
  } catch (error) {
    console.error('Error adding production order operation:', error);
    res.status(500).json({ error: 'Failed to add production order operation' });
  }
});

// Update production order operation
router.put('/:productionOrderId/operations/:operationId', async (req, res) => {
  try {
    const { name, description, sequence_number, assigned_to, estimated_time_minutes, labor_rate } = req.body;
    const { productionOrderId, operationId } = req.params;
    const currentOperations = await runQuery('SELECT * FROM production_order_operations WHERE id = ?', [operationId]);
    if (currentOperations.length === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    await runStatement(`
      UPDATE production_order_operations SET name = ?, description = ?, sequence_number = ?, assigned_to = ?, estimated_time_minutes = ?, labor_rate = ? WHERE id = ?
    `, [name, description || '', sequence_number, assigned_to || null, estimated_time_minutes || 0, labor_rate || 0, operationId]);
    await logAuditTrail('production_order_operations', operationId, 'UPDATE', currentOperations[0], req.body, req.user.id);
    res.json({ id: operationId, message: 'Operation updated successfully' });
  } catch (error) {
    console.error('Error updating production order operation:', error);
    res.status(500).json({ error: 'Failed to update production order operation' });
  }
});

// Delete production order operation
router.delete('/:productionOrderId/operations/:operationId', async (req, res) => {
  try {
    const { productionOrderId, operationId } = req.params;
    const currentOperations = await runQuery('SELECT * FROM production_order_operations WHERE id = ?', [operationId]);
    if (currentOperations.length === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    await runStatement('DELETE FROM production_order_operations WHERE id = ?', [operationId]);
    await logAuditTrail('production_order_operations', operationId, 'DELETE', currentOperations[0], null, req.user.id);
    res.json({ message: 'Operation deleted successfully' });
  } catch (error) {
    console.error('Error deleting production order operation:', error);
    res.status(500).json({ error: 'Failed to delete production order operation' });
  }
});

export default router; 