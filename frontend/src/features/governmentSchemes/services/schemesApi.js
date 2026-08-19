import { apiClient } from '../../../services/apiClient';

export const schemesApi = {
  getSchemes: async () => {
    const response = await apiClient.get('/government-schemes');
    return response.data;
  },

  getSchemeById: async (id) => {
    const response = await apiClient.get(`/government-schemes/${id}`);
    return response.data;
  }
};
