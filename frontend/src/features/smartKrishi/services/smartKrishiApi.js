import { apiClient } from '../../../services/apiClient';

export const smartKrishiApi = {
  getCropSeasons: async (cropId) => {
    const response = await apiClient.get(`/smart-krishi/crops/${cropId}/seasons`);
    return response.data;
  },

  getAdvisory: async (advisoryRequest) => {
    const response = await apiClient.post('/smart-krishi/advisory', advisoryRequest);
    return response.data;
  }
};
