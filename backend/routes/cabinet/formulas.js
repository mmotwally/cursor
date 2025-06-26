import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all formulas
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery('SELECT * FROM cabinet_formulas ORDER BY name');
    const result = rows.map(row => ({ ...row, partTypes: JSON.parse(row.part_types || '[]') }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch formulas' });
  }
});

// Add new formula
router.post('/', async (req, res) => {
  try {
    const { name, formulaH, formulaW, partTypes } = req.body;
    if (!name || !formulaH || !formulaW || !Array.isArray(partTypes)) return res.status(400).json({ error: 'All fields required' });
    const result = await runStatement(
      'INSERT INTO cabinet_formulas (name, formulaH, formulaW, part_types) VALUES (?, ?, ?, ?)',
      [name, formulaH, formulaW, JSON.stringify(partTypes)]
    );
    res.status(201).json({ id: result.id, name, formulaH, formulaW, partTypes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add formula' });
  }
});

// Update formula
router.put('/:id', async (req, res) => {
  try {
    const { name, formulaH, formulaW, partTypes } = req.body;
    const { id } = req.params;
    await runStatement(
      'UPDATE cabinet_formulas SET name = ?, formulaH = ?, formulaW = ?, part_types = ? WHERE id = ?',
      [name, formulaH, formulaW, JSON.stringify(partTypes), id]
    );
    res.json({ id, name, formulaH, formulaW, partTypes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update formula' });
  }
});

// Delete formula
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_formulas WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete formula' });
  }
});

export default router; 