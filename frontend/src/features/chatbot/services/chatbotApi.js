import { apiClient } from '../../../services/apiClient';

export const chatbotApi = {
  sendMessage: async (message, language = 'en') => {
    const response = await apiClient.post('/chatbot/message', { message, language });
    return response.data;
  }
};
