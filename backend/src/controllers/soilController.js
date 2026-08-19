import { District } from '../models/District.js';
import { Soil } from '../models/Soil.js';
import { Crop } from '../models/Crop.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getLocalizedField, isValidObjectId } from '../utils/validators.js';

import { districtsData } from '../seed/districts.js';
import { cropsData } from '../seed/crops.js';
import { soilTemplatesByRegion } from '../seed/soilData.js';

export const getDistricts = async (req, res, next) => {
  try {
    const lang = req.lang || 'en';
    let districts = [];
    try {
      districts = await District.find().sort({ 'districtName.en': 1 });
    } catch (err) {
      districts = [];
    }

    if (!districts || districts.length === 0) {
      // Fallback to seeded districtsData
      const formattedFallback = districtsData.map((d) => ({
        _id: `dist_${d.districtCode.toLowerCase()}`,
        districtCode: d.districtCode,
        districtName: getLocalizedField(d.districtName, lang),
        region: getLocalizedField(d.region, lang),
        coordinates: d.coordinates
      }));
      return successResponse(res, 'Gujarat districts fetched successfully', formattedFallback);
    }

    const formatted = districts.map((d) => ({
      _id: d._id,
      districtCode: d.districtCode,
      districtName: getLocalizedField(d.districtName, lang),
      region: getLocalizedField(d.region, lang),
      coordinates: d.coordinates
    }));

    return successResponse(res, 'Gujarat districts fetched successfully', formatted);
  } catch (error) {
    next(error);
  }
};

export const getDistrictById = async (req, res, next) => {
  try {
    const { districtId } = req.params;
    const lang = req.lang || 'en';

    let districtDoc = null;
    let soilDoc = null;

    try {
      if (isValidObjectId(districtId)) {
        districtDoc = await District.findById(districtId);
      } else {
        districtDoc = await District.findOne({ districtCode: districtId.toUpperCase() });
      }
      if (districtDoc) {
        soilDoc = await Soil.findOne({ district: districtDoc._id });
      }
    } catch (err) {
      districtDoc = null;
    }

    // Fallback if DB not seeded or disconnected
    if (!districtDoc) {
      const match = districtsData.find(
        (d) => d.districtCode.toUpperCase() === districtId.toUpperCase() || `dist_${d.districtCode.toLowerCase()}` === districtId
      );
      if (!match) {
        return errorResponse(res, 'District not found', null, 404);
      }
      districtDoc = match;
      const regionEn = match.region.en;
      const soilTemplate = soilTemplatesByRegion[regionEn] || soilTemplatesByRegion['Central Gujarat'];
      soilDoc = {
        soilType: soilTemplate.soilType,
        averagePH: soilTemplate.averagePH,
        npkInfo: soilTemplate.npkInfo,
        waterSources: soilTemplate.waterSources,
        nearbyAPMCMarkets: soilTemplate.nearbyAPMCMarkets
      };
    }

    const responseData = {
      _id: districtDoc._id || `dist_${districtDoc.districtCode.toLowerCase()}`,
      districtCode: districtDoc.districtCode,
      districtName: getLocalizedField(districtDoc.districtName, lang),
      region: getLocalizedField(districtDoc.region, lang),
      coordinates: districtDoc.coordinates,
      soilInformation: {
        soilType: getLocalizedField(soilDoc.soilType, lang),
        averagePH: soilDoc.averagePH,
        npkInfo: soilDoc.npkInfo,
        waterSources: (soilDoc.waterSources || []).map((w) => getLocalizedField(w, lang)),
        nearbyAPMCMarkets: (soilDoc.nearbyAPMCMarkets || []).map((m) => getLocalizedField(m, lang))
      }
    };

    return successResponse(res, 'District details fetched successfully', responseData);
  } catch (error) {
    next(error);
  }
};

export const getDistrictCrops = async (req, res, next) => {
  try {
    const { districtId } = req.params;
    const lang = req.lang || 'en';

    let districtDoc = null;
    let crops = [];

    try {
      if (isValidObjectId(districtId)) {
        districtDoc = await District.findById(districtId);
      } else {
        districtDoc = await District.findOne({ districtCode: districtId.toUpperCase() });
      }

      if (districtDoc) {
        crops = await Crop.find({
          $or: [
            { suitableDistricts: districtDoc._id },
            { suitableDistrictCodes: districtDoc.districtCode },
            { suitableDistrictCodes: districtDoc.districtCode?.toUpperCase() }
          ]
        });
      }
    } catch (err) {
      districtDoc = null;
    }

    // Fallback if DB query returned no crops
    if (!districtDoc || crops.length === 0) {
      const codeToSearch = districtDoc?.districtCode || districtId.replace('dist_', '').toUpperCase();
      const match = districtsData.find(
        (d) => d.districtCode.toUpperCase() === codeToSearch.toUpperCase()
      ) || districtsData[0];

      districtDoc = districtDoc || match;

      const fallbackCode = match.districtCode;
      crops = cropsData.filter((c) => (c.suitableDistrictCodes || []).includes(fallbackCode));
    }

    const formattedCrops = crops.map((c) => ({
      _id: c._id || `crop_${c.cropCode}`,
      cropCode: c.cropCode,
      name: getLocalizedField(c.name, lang),
      category: c.category,
      availableSeasons: (c.seasons || []).map((s) => ({
        seasonCode: s.seasonCode,
        name: getLocalizedField(s.name, lang),
        idealMonths: getLocalizedField(s.idealMonths, lang)
      }))
    }));

    return successResponse(
      res,
      `Crops for district ${getLocalizedField(districtDoc.districtName, lang)} fetched successfully`,
      formattedCrops
    );
  } catch (error) {
    next(error);
  }
};
