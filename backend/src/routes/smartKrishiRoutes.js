import express from 'express';
import { getCropSeasons, getSmartKrishiAdvisory } from '../controllers/smartKrishiController.js';
import { validateLanguage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/crops/:cropId/seasons', validateLanguage, getCropSeasons);
router.post('/advisory', validateLanguage, getSmartKrishiAdvisory);

export default router;
