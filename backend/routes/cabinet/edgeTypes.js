import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all edge types
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM cabinet_edge_types ORDER BY value');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch edge types' });
  }
});

// Add new edge type
router.post('/', async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Value is required' });
    const result = await runStatement(
      'INSERT INTO cabinet_edge_types (value) VALUES (?)',
      [value]
    );
    res.status(201).json({ id: result.id, value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add edge type' });
  }
});

// Update edge type
router.put('/:id', async (req, res) => {
  try {
    const { value } = req.body;
    const { id } = req.params;
    await runStatement(
      'UPDATE cabinet_edge_types SET value = ? WHERE id = ?',
      [value, id]
    );
    res.json({ id, value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update edge type' });
  }
});

// Delete edge type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_edge_types WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete edge type' });
  }
});

export default router; 