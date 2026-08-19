import { apiClient } from '../../../services/apiClient';

export const weatherApi = {
  getWeather: async (district = 'Anand', lat = null, lon = null) => {
    const params = { district };
    if (lat && lon) {
      params.latitude = lat;
      params.longitude = lon;
    }
    const response = await apiClient.get('/weather', { params });
    return response.data;
  }
};
