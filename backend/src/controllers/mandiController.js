import { mandiService } from '../services/mandiService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getMandiRates = async (req, res, next) => {
  try {
    const { district, market, commodity, language } = req.query;
    const lang = language || req.lang || 'en';

    const rates = await mandiService.getRates({
      district,
      market,
      commodity,
      lang
    });

    return successResponse(res, 'Mandi commodity rates fetched successfully', rates);
  } catch (error) {
    next(error);
  }
};
