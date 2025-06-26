import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all part types
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM cabinet_part_types ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch part types' });
  }
});

// Add new part type
router.post('/', async (req, res) => {
  try {
    const { name, default_width_formula, default_height_formula } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await runStatement(
      'INSERT INTO cabinet_part_types (name, default_width_formula, default_height_formula) VALUES (?, ?, ?)',
      [name, default_width_formula || '', default_height_formula || '']
    );
    res.status(201).json({ id: result.id, name, default_width_formula, default_height_formula });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add part type' });
  }
});

// Update part type
router.put('/:id', async (req, res) => {
  try {
    const { name, default_width_formula, default_height_formula } = req.body;
    const { id } = req.params;
    await runStatement(
      'UPDATE cabinet_part_types SET name = ?, default_width_formula = ?, default_height_formula = ? WHERE id = ?',
      [name, default_width_formula || '', default_height_formula || '', id]
    );
    res.json({ id, name, default_width_formula, default_height_formula });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update part type' });
  }
});

// Delete part type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_part_types WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete part type' });
  }
});

export default router; 