import express from 'express';
import { handleChatbotMessage } from '../controllers/chatbotController.js';
import { validateLanguage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/message', validateLanguage, handleChatbotMessage);

export default router;
