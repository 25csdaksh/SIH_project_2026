import { apiClient } from '../../../services/apiClient';

export const soilApi = {
  getDistricts: async () => {
    const response = await apiClient.get('/soil/districts');
    return response.data;
  },

  getDistrictById: async (districtId) => {
    const response = await apiClient.get(`/soil/district/${districtId}`);
    return response.data;
  },

  getDistrictCrops: async (districtId) => {
    const response = await apiClient.get(`/soil/district/${districtId}/crops`);
    return response.data;
  }
};
