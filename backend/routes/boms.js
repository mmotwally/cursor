import express from 'express';
import mainRouter from './boms/main.js';
import componentsRouter from './boms/components.js';
import operationsRouter from './boms/operations.js';

const router = express.Router();

router.use('/', mainRouter);
router.use('/', componentsRouter);
router.use('/', operationsRouter);

export default router;