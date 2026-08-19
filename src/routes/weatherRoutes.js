import express from 'express';
import { getWeather } from '../controllers/weatherController.js';
import { validateLanguage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', validateLanguage, getWeather);

export default router;
