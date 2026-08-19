import express from 'express';
import { analyzePestImage } from '../controllers/pestController.js';
import { uploadPestImage } from '../middleware/uploadMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { validateLanguage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/analyze', optionalAuth, validateLanguage, uploadPestImage.single('image'), analyzePestImage);

export default router;
