import { apiClient } from '../../../services/apiClient';

export const pestDetectionApi = {
  analyzeImage: async (formData) => {
    const response = await apiClient.post('/pest-detection/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
