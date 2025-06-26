import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';
import { logAuditTrail } from '../../utils/audit.js';

const router = express.Router();

router.use(authenticateToken);

// Add BOM operation
router.post('/:bomId/operations', async (req, res) => {
  try {
    const { name, description, sequence_number, estimated_time_minutes, labor_rate } = req.body;
    const bomId = req.params.bomId;
    if (!name || !sequence_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await runStatement(`
      INSERT INTO bom_operations (bom_id, name, description, sequence_number, estimated_time_minutes, labor_rate)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [bomId, name, description || '', sequence_number, estimated_time_minutes || 0, labor_rate || 0]);
    await logAuditTrail('bom_operations', result.id, 'INSERT', null, req.body, req.user.id);
    res.status(201).json({ id: result.id, message: 'Operation added successfully' });
  } catch (error) {
    console.error('Error adding BOM operation:', error);
    res.status(500).json({ error: 'Failed to add BOM operation' });
  }
});

// Update BOM operation
router.put('/:bomId/operations/:operationId', async (req, res) => {
  try {
    const { name, description, sequence_number, estimated_time_minutes, labor_rate } = req.body;
    const { bomId, operationId } = req.params;
    const currentOperations = await runQuery('SELECT * FROM bom_operations WHERE id = ?', [operationId]);
    if (currentOperations.length === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    await runStatement(`
      UPDATE bom_operations SET name = ?, description = ?, sequence_number = ?, estimated_time_minutes = ?, labor_rate = ? WHERE id = ?
    `, [name, description || '', sequence_number, estimated_time_minutes || 0, labor_rate || 0, operationId]);
    await logAuditTrail('bom_operations', operationId, 'UPDATE', currentOperations[0], req.body, req.user.id);
    res.json({ id: operationId, message: 'Operation updated successfully' });
  } catch (error) {
    console.error('Error updating BOM operation:', error);
    res.status(500).json({ error: 'Failed to update BOM operation' });
  }
});

// Delete BOM operation
router.delete('/:bomId/operations/:operationId', async (req, res) => {
  try {
    const { bomId, operationId } = req.params;
    const currentOperations = await runQuery('SELECT * FROM bom_operations WHERE id = ?', [operationId]);
    if (currentOperations.length === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    await runStatement('DELETE FROM bom_operations WHERE id = ?', [operationId]);
    await logAuditTrail('bom_operations', operationId, 'DELETE', currentOperations[0], null, req.user.id);
    res.json({ message: 'Operation deleted successfully' });
  } catch (error) {
    console.error('Error deleting BOM operation:', error);
    res.status(500).json({ error: 'Failed to delete BOM operation' });
  }
});

export default router; 