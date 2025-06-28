import express from 'express';
import db from '../../database/connection.js';

const router = express.Router();

// GET /api/production-orders/stats/overview
router.get('/overview', async (req, res) => {
  try {
    // Get total count of production orders
    const totalOrdersResult = await db.get(`
      SELECT COUNT(*) as total_orders FROM production_orders
    `);

    // Get counts by status
    const statusCountsResult = await db.all(`
      SELECT status, COUNT(*) as count 
      FROM production_orders 
      GROUP BY status
    `);

    // Get total planned cost
    const plannedCostResult = await db.get(`
      SELECT COALESCE(SUM(planned_cost), 0) as total_planned_cost 
      FROM production_orders
    `);

    // Get total actual cost
    const actualCostResult = await db.get(`
      SELECT COALESCE(SUM(actual_cost), 0) as total_actual_cost 
      FROM production_orders
    `);

    // Get average completion time for completed orders
    const avgCompletionResult = await db.get(`
      SELECT AVG(
        CASE 
          WHEN status = 'Completed' AND start_date IS NOT NULL AND end_date IS NOT NULL
          THEN (julianday(end_date) - julianday(start_date))
          ELSE NULL
        END
      ) as avg_completion_days
      FROM production_orders
    `);

    // Format status counts into an object
    const statusCounts = {};
    statusCountsResult.forEach(row => {
      statusCounts[row.status] = row.count;
    });

    // Ensure all expected statuses are present
    const expectedStatuses = ['Draft', 'Released', 'In Progress', 'Completed', 'Cancelled'];
    expectedStatuses.forEach(status => {
      if (!statusCounts[status]) {
        statusCounts[status] = 0;
      }
    });

    const stats = {
      totalOrders: totalOrdersResult.total_orders || 0,
      statusCounts,
      totalPlannedCost: plannedCostResult.total_planned_cost || 0,
      totalActualCost: actualCostResult.total_actual_cost || 0,
      avgCompletionTime: avgCompletionResult.avg_completion_days || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching production order stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch production order statistics',
      details: error.message 
    });
  }
});

export default router;