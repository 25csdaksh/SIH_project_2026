import { smartKrishiService } from '../services/smartKrishiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getCropSeasons = async (req, res, next) => {
  try {
    const { cropId } = req.params;
    const lang = req.lang || 'en';

    const seasons = await smartKrishiService.getAvailableSeasonsForCrop(cropId, lang);
    return successResponse(res, 'Available seasons for selected crop fetched successfully', seasons);
  } catch (error) {
    next(error);
  }
};

export const getSmartKrishiAdvisory = async (req, res, next) => {
  try {
    const { districtId, cropId, season, language } = req.body;

    if (!districtId || !cropId || !season) {
      return errorResponse(res, 'Please provide districtId, cropId, and season.', null, 400);
    }

    const advisory = await smartKrishiService.generateAdvisory({
      districtId,
      cropId,
      season,
      language: language || req.lang || 'en'
    });

    return successResponse(res, 'Smart Krishi agricultural advisory generated successfully', advisory);
  } catch (error) {
    next(error);
  }
};
