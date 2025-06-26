import express from 'express';
import { checkPermission } from '../../middleware/auth.js';
import { handleInventoryExport, handleInventoryImport } from '../../utils/inventoryHelpers.js';

const router = express.Router();

// Export to CSV
router.get('/export/csv', checkPermission('inventory.export'), async (req, res) => {
  try {
    const { columns, title, columnWidths } = req.query;
    const options = {
      columns: columns ? columns.split(',') : undefined,
      title: title || undefined,
      columnWidths: columnWidths ? JSON.parse(columnWidths) : undefined
    };
    await handleInventoryExport(req, res, 'csv', options);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// Import from CSV
router.post('/import/csv', checkPermission('inventory.import'), async (req, res) => {
  try {
    await handleInventoryImport(req, res);
  } catch (error) {
    console.error('Error importing CSV:', error);
    res.status(500).json({ error: 'Failed to import CSV' });
  }
});

// Generate PDF report
router.get('/export/pdf', checkPermission('inventory.export'), async (req, res) => {
  try {
    const { columns, title, columnWidths, orientation } = req.query;
    const options = {
      columns: columns ? columns.split(',') : undefined,
      title: title || undefined,
      columnWidths: columnWidths ? JSON.parse(columnWidths) : undefined,
      orientation: orientation || 'portrait'
    };
    await handleInventoryExport(req, res, 'pdf', options);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router; 