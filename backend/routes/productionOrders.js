import express from 'express';
import mainRouter from './productionOrders/main.js';
import itemsRouter from './productionOrders/items.js';
import operationsRouter from './productionOrders/operations.js';
import actionsRouter from './productionOrders/actions.js';

const router = express.Router();

router.use('/', mainRouter);
router.use('/', itemsRouter);
router.use('/', operationsRouter);
router.use('/', actionsRouter);

export default router;