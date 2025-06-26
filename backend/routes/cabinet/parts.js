import express from 'express';
import { runQuery, runStatement } from '../../database/connection.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all cabinet parts (with joins)
router.get('/', async (req, res) => {
  try {
    const rows = await runQuery(`
      SELECT p.*, 
        pt.name as part_type, 
        mt.name as material_type, 
        mth.value as material_thickness, 
        eth.value as edge_thickness
      FROM cabinet_parts p
      LEFT JOIN cabinet_part_types pt ON p.part_type_id = pt.id
      LEFT JOIN cabinet_material_types mt ON p.material_type_id = mt.id
      LEFT JOIN cabinet_material_thicknesses mth ON p.material_thickness_id = mth.id
      LEFT JOIN cabinet_edge_thicknesses eth ON p.edge_thickness_id = eth.id
      ORDER BY p.id DESC
    `);
    // Parse JSON fields
    const result = rows.map(row => ({
      ...row,
      accessories: row.accessories ? JSON.parse(row.accessories) : [],
      edge_banding: row.edge_banding ? JSON.parse(row.edge_banding) : { front: false, back: false, top: false, bottom: false }
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cabinet parts' });
  }
});

// Add new cabinet part
router.post('/', async (req, res) => {
  try {
    const {
      part_type_id,
      material_type_id,
      material_thickness_id,
      edge_thickness_id,
      accessories,
      edge_banding,
      width_formula,
      height_formula,
      custom_width_formula,
      custom_height_formula
    } = req.body;
    const result = await runStatement(
      `INSERT INTO cabinet_parts (
        part_type_id, material_type_id, material_thickness_id, edge_thickness_id,
        accessories, edge_banding, width_formula, height_formula, custom_width_formula, custom_height_formula
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        part_type_id,
        material_type_id,
        material_thickness_id,
        edge_thickness_id,
        JSON.stringify(accessories || []),
        JSON.stringify(edge_banding || {}),
        width_formula || '',
        height_formula || '',
        custom_width_formula || '',
        custom_height_formula || ''
      ]
    );
    res.status(201).json({ id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add cabinet part' });
  }
});

// Update cabinet part
router.put('/:id', async (req, res) => {
  try {
    const {
      part_type_id,
      material_type_id,
      material_thickness_id,
      edge_thickness_id,
      accessories,
      edge_banding,
      width_formula,
      height_formula,
      custom_width_formula,
      custom_height_formula
    } = req.body;
    const { id } = req.params;
    await runStatement(
      `UPDATE cabinet_parts SET
        part_type_id = ?, material_type_id = ?, material_thickness_id = ?, edge_thickness_id = ?,
        accessories = ?, edge_banding = ?, width_formula = ?, height_formula = ?, custom_width_formula = ?, custom_height_formula = ?
      WHERE id = ?`,
      [
        part_type_id,
        material_type_id,
        material_thickness_id,
        edge_thickness_id,
        JSON.stringify(accessories || []),
        JSON.stringify(edge_banding || {}),
        width_formula || '',
        height_formula || '',
        custom_width_formula || '',
        custom_height_formula || '',
        id
      ]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cabinet part' });
  }
});

// Delete cabinet part
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runStatement('DELETE FROM cabinet_parts WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cabinet part' });
  }
});

export default router; 