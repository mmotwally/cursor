import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import itemsRouter from './inventory/items.js';
import stockRouter from './inventory/stock.js';
import exportImportRouter from './inventory/exportImport.js';
import dropdownRouter from './inventory/dropdown.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Mount sub-routers
router.use('/items', itemsRouter);
router.use('/', stockRouter);
router.use('/', exportImportRouter);
router.use('/', dropdownRouter);

export default router;