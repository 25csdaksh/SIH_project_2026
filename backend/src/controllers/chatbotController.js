import { geminiService } from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const handleChatbotMessage = async (req, res, next) => {
  try {
    const { message, language } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return errorResponse(res, 'Please provide a valid question or message.', null, 400);
    }

    const lang = language || req.lang || 'en';
    const reply = await geminiService.generateChatResponse(message.trim(), lang);

    return successResponse(res, 'AI Chatbot response generated successfully', {
      reply,
      language: lang
    });
  } catch (error) {
    next(error);
  }
};
