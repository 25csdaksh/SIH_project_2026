import express from 'express';
import { getSchemes, getSchemeById } from '../controllers/schemeController.js';
import { validateLanguage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', validateLanguage, getSchemes);
router.get('/:id', validateLanguage, getSchemeById);

export default router;
