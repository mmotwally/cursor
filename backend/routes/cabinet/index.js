import express from 'express';
import partTypesRouter from './partTypes.js';
import materialTypesRouter from './materialTypes.js';
import materialThicknessesRouter from './materialThicknesses.js';
import edgeThicknessesRouter from './edgeThicknesses.js';
import accessoriesRouter from './accessories.js';
import partsRouter from './parts.js';
import edgeTypesRouter from './edgeTypes.js';
import formulasRouter from './formulas.js';

const router = express.Router();

router.use('/part-types', partTypesRouter);
router.use('/material-types', materialTypesRouter);
router.use('/material-thicknesses', materialThicknessesRouter);
router.use('/edge-thicknesses', edgeThicknessesRouter);
router.use('/accessories', accessoriesRouter);
router.use('/parts', partsRouter);
router.use('/edge-types', edgeTypesRouter);
router.use('/formulas', formulasRouter);

export default router; 