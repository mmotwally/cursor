import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all accessories
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM cabinet_accessories ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch accessories' });
  }
});

// Add new accessory
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const result = await runStatement(
      'INSERT INTO cabinet_accessories (name) VALUES (?)',
      [name]
    );
    res.status(201).json({ id: result.id, name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add accessory' });
  }
});

// Update accessory
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    await runStatement(
      'UPDATE cabinet_accessories SET name = ? WHERE id = ?',
      [name, id]
    );
    res.json({ id, name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update accessory' });
  }
});

// Delete accessory
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_accessories WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete accessory' });
  }
});

export default router; 