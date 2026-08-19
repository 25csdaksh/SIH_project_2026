import { weatherService } from '../services/weatherService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getWeather = async (req, res, next) => {
  try {
    const { district = 'Anand', latitude, longitude, language } = req.query;
    const lang = language || req.lang || 'en';

    const weatherData = await weatherService.getWeather(
      district,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      lang
    );

    return successResponse(res, `Live weather information for ${district}`, weatherData);
  } catch (error) {
    next(error);
  }
};
