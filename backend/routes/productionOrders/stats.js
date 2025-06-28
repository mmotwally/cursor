import express from 'express';
import { runQuery } from '../../database/connection.js';

const router = express.Router();

// GET /api/production-orders/stats/overview
router.get('/overview', async (req, res) => {
  try {
    // Get total count of production orders
    const totalOrdersResult = (await runQuery(`
      SELECT COUNT(*) as total_orders FROM production_orders
    `))[0];

    // Get counts by status
    const statusCountsResult = await runQuery(`
      SELECT status, COUNT(*) as count 
      FROM production_orders 
      GROUP BY status
    `);

    // Get total planned cost
    const plannedCostResult = (await runQuery(`
      SELECT COALESCE(SUM(planned_cost), 0) as total_planned_cost 
      FROM production_orders
    `))[0];

    // Get total actual cost
    const actualCostResult = (await runQuery(`
      SELECT COALESCE(SUM(actual_cost), 0) as total_actual_cost 
      FROM production_orders
    `))[0];

    // Get average completion time for completed orders
    const avgCompletionResult = (await runQuery(`
      SELECT AVG(
        CASE 
          WHEN status = 'completed' AND start_date IS NOT NULL AND completion_date IS NOT NULL
          THEN (julianday(completion_date) - julianday(start_date))
          ELSE NULL
        END
      ) as avg_completion_days
      FROM production_orders
    `))[0];

    // Format status counts into an object
    const statusCounts = {};
    statusCountsResult.forEach(row => {
      statusCounts[row.status] = row.count;
    });

    // Ensure all expected statuses are present
    const expectedStatuses = ['draft', 'planned', 'in_progress', 'completed', 'cancelled'];
    expectedStatuses.forEach(status => {
      if (!statusCounts[status]) {
        statusCounts[status] = 0;
      }
    });

    const stats = {
      total_orders: totalOrdersResult.total_orders || 0,
      draft_count: statusCounts['draft'] || 0,
      planned_count: statusCounts['planned'] || 0,
      in_progress_count: statusCounts['in_progress'] || 0,
      completed_count: statusCounts['completed'] || 0,
      cancelled_count: statusCounts['cancelled'] || 0,
      total_planned_cost: plannedCostResult.total_planned_cost || 0,
      total_actual_cost: actualCostResult.total_actual_cost || 0,
      avg_completion_time_days: avgCompletionResult.avg_completion_days || 0
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