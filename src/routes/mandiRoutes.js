import express from 'express';
import { getMandiRates } from '../controllers/mandiController.js';
import { validateLanguage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/rates', validateLanguage, getMandiRates);

export default router;
