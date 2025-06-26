import express from 'express';
import { runQuery } from '../../database/connection.js';
import { checkPermission } from '../../middleware/auth.js';

const router = express.Router();

// Get dropdown data
router.get('/dropdown-data', checkPermission('inventory.view'), async (req, res) => {
  try {
    const [categories, subcategories, units, locations, suppliers] = await Promise.all([
      runQuery('SELECT * FROM categories ORDER BY name'),
      runQuery('SELECT * FROM subcategories ORDER BY name'),
      runQuery('SELECT * FROM units ORDER BY name'),
      runQuery('SELECT * FROM locations ORDER BY name'),
      runQuery('SELECT * FROM suppliers ORDER BY name')
    ]);
    res.json({
      categories: categories || [],
      subcategories: subcategories || [],
      units: units || [],
      locations: locations || [],
      suppliers: suppliers || []
    });
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    res.status(500).json({ error: 'Failed to fetch dropdown data' });
  }
});

export default router; 