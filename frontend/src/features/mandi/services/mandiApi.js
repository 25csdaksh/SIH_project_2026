import { apiClient } from '../../../services/apiClient';

export const mandiApi = {
  getRates: async (filters = {}) => {
    const response = await apiClient.get('/mandi/rates', { params: filters });
    return response.data;
  }
};
