import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all material types
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM cabinet_material_types ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch material types' });
  }
});

// Add new material type
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await runStatement(
      'INSERT INTO cabinet_material_types (name) VALUES (?)',
      [name]
    );
    res.status(201).json({ id: result.id, name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add material type' });
  }
});

// Update material type
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    await runStatement(
      'UPDATE cabinet_material_types SET name = ? WHERE id = ?',
      [name, id]
    );
    res.json({ id, name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update material type' });
  }
});

// Delete material type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_material_types WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete material type' });
  }
});

export default router; 