import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';
import { logAuditTrail } from '../../utils/audit.js';

const router = express.Router();

router.use(authenticateToken);

// Add BOM component
router.post('/:bomId/components', async (req, res) => {
  try {
    const { item_id, quantity, unit_id, sort_order } = req.body;
    const bomId = req.params.bomId;
    if (!item_id || !quantity || !unit_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await runStatement(`
      INSERT INTO bom_components (bom_id, item_id, quantity, unit_id, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `, [bomId, item_id, quantity, unit_id, sort_order || 0]);
    await logAuditTrail('bom_components', result.id, 'INSERT', null, req.body, req.user.id);
    res.status(201).json({ id: result.id, message: 'Component added successfully' });
  } catch (error) {
    console.error('Error adding BOM component:', error);
    res.status(500).json({ error: 'Failed to add BOM component' });
  }
});

// Update BOM component
router.put('/:bomId/components/:componentId', async (req, res) => {
  try {
    const { quantity, unit_id, sort_order } = req.body;
    const { bomId, componentId } = req.params;
    const currentComponents = await runQuery('SELECT * FROM bom_components WHERE id = ?', [componentId]);
    if (currentComponents.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }
    await runStatement(`
      UPDATE bom_components SET quantity = ?, unit_id = ?, sort_order = ? WHERE id = ?
    `, [quantity, unit_id, sort_order || 0, componentId]);
    await logAuditTrail('bom_components', componentId, 'UPDATE', currentComponents[0], req.body, req.user.id);
    res.json({ id: componentId, message: 'Component updated successfully' });
  } catch (error) {
    console.error('Error updating BOM component:', error);
    res.status(500).json({ error: 'Failed to update BOM component' });
  }
});

// Delete BOM component
router.delete('/:bomId/components/:componentId', async (req, res) => {
  try {
    const { bomId, componentId } = req.params;
    const currentComponents = await runQuery('SELECT * FROM bom_components WHERE id = ?', [componentId]);
    if (currentComponents.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }
    await runStatement('DELETE FROM bom_components WHERE id = ?', [componentId]);
    await logAuditTrail('bom_components', componentId, 'DELETE', currentComponents[0], null, req.user.id);
    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting BOM component:', error);
    res.status(500).json({ error: 'Failed to delete BOM component' });
  }
});

export default router; 