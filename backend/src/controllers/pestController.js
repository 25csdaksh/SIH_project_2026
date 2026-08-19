import { pestDetectionService } from '../services/pestDetectionService.js';
import { PestDetection } from '../models/PestDetection.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getLocalizedField } from '../utils/validators.js';

export const analyzePestImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload a crop/pest image file.', null, 400);
    }

    const language = req.body.language || req.lang || 'en';
    const filePath = req.file.path;

    const analysis = await pestDetectionService.analyzeImage(filePath, language);

    // Save record to DB history
    try {
      await PestDetection.create({
        user: req.user ? req.user._id : null,
        imageUrl: analysis.imageUrl,
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        description: analysis.description,
        recommendedAction: analysis.recommendedAction,
        prevention: analysis.prevention
      });
    } catch (dbErr) {
      // Non-blocking warning if DB save fails
    }

    const responseData = {
      imageUrl: analysis.imageUrl,
      diseaseName: getLocalizedField(analysis.diseaseName, language),
      confidence: `${analysis.confidence}%`,
      description: getLocalizedField(analysis.description, language),
      recommendedAction: getLocalizedField(analysis.recommendedAction, language),
      prevention: getLocalizedField(analysis.prevention, language)
    };

    return successResponse(res, 'Crop image analyzed successfully', responseData);
  } catch (error) {
    next(error);
  }
};
