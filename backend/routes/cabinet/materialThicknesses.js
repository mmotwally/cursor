import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all material thicknesses
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM cabinet_material_thicknesses ORDER BY value');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch material thicknesses' });
  }
});

// Add new material thickness
router.post('/', async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Value is required' });
    const result = await runStatement(
      'INSERT INTO cabinet_material_thicknesses (value) VALUES (?)',
      [value]
    );
    res.status(201).json({ id: result.id, value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add material thickness' });
  }
});

// Update material thickness
router.put('/:id', async (req, res) => {
  try {
    const { value } = req.body;
    const { id } = req.params;
    await runStatement(
      'UPDATE cabinet_material_thicknesses SET value = ? WHERE id = ?',
      [value, id]
    );
    res.json({ id, value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update material thickness' });
  }
});

// Delete material thickness
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_material_thicknesses WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete material thickness' });
  }
});

export default router; 