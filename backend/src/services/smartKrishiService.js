import { District } from '../models/District.js';
import { Crop } from '../models/Crop.js';
import { Soil } from '../models/Soil.js';
import { SmartKrishi } from '../models/SmartKrishi.js';
import { weatherService } from './weatherService.js';
import { logger } from '../utils/logger.js';
import { getLocalizedField, sanitizeLanguage, isValidObjectId } from '../utils/validators.js';

import { districtsData } from '../seed/districts.js';
import { cropsData } from '../seed/crops.js';
import { soilTemplatesByRegion } from '../seed/soilData.js';

export const smartKrishiService = {
  getAvailableSeasonsForCrop: async (cropId, lang = 'en') => {
    let crop = null;
    try {
      if (isValidObjectId(cropId)) {
        crop = await Crop.findById(cropId);
      }
    } catch (err) {
      crop = null;
    }

    if (!crop) {
      const code = cropId.replace('crop_', '');
      const match = cropsData.find((c) => c.cropCode === code);
      if (!match) {
        throw new Error('Crop not found.');
      }
      crop = match;
    }

    const sanitizedLang = sanitizeLanguage(lang);
    return crop.seasons.map((s) => ({
      seasonCode: s.seasonCode,
      name: getLocalizedField(s.name, sanitizedLang),
      idealMonths: getLocalizedField(s.idealMonths, sanitizedLang)
    }));
  },

  generateAdvisory: async ({ districtId, cropId, season, language = 'en' }) => {
    const sanitizedLang = sanitizeLanguage(language);

    // 1. Validate District
    let districtDoc = null;
    try {
      if (isValidObjectId(districtId)) {
        districtDoc = await District.findById(districtId);
      }
    } catch (err) {
      districtDoc = null;
    }

    if (!districtDoc) {
      const code = districtId.replace('dist_', '').toUpperCase();
      const match = districtsData.find((d) => d.districtCode.toUpperCase() === code);
      if (!match) {
        const err = new Error('Selected District does not exist.');
        err.statusCode = 404;
        throw err;
      }
      districtDoc = match;
    }

    // 2. Validate Crop
    let cropDoc = null;
    try {
      if (isValidObjectId(cropId)) {
        cropDoc = await Crop.findById(cropId);
      }
    } catch (err) {
      cropDoc = null;
    }

    if (!cropDoc) {
      const code = cropId.replace('crop_', '');
      const match = cropsData.find((c) => c.cropCode === code);
      if (!match) {
        const err = new Error('Selected Crop does not exist.');
        err.statusCode = 404;
        throw err;
      }
      cropDoc = match;
    }

    // 3. Query MongoDB SmartKrishi collection for matching record
    let storedAdvisory = null;
    try {
      if (districtDoc._id && cropDoc._id) {
        storedAdvisory = await SmartKrishi.findOne({
          district: districtDoc._id,
          crop: cropDoc._id,
          season: season.toLowerCase()
        });
      }
    } catch (err) {
      storedAdvisory = null;
    }

    if (storedAdvisory) {
      return {
        district: getLocalizedField(districtDoc.districtName, sanitizedLang),
        crop: getLocalizedField(cropDoc.name, sanitizedLang),
        season: storedAdvisory.season,
        soilInformation: storedAdvisory.soil?.types?.join(', ') || getLocalizedField(storedAdvisory.soilInformation, sanitizedLang),
        phLevel: storedAdvisory.phLevel || storedAdvisory.soil?.phRange,
        npkLevel: storedAdvisory.npkLevel || {
          nitrogen: storedAdvisory.soil?.nitrogen?.recommendedRange || 'Medium',
          phosphorus: storedAdvisory.soil?.phosphorus?.recommendedRange || 'Medium',
          potassium: storedAdvisory.soil?.potassium?.recommendedRange || 'Medium'
        },
        weatherInformation: storedAdvisory.weatherRequirements?.temperature ? `Temp: ${storedAdvisory.weatherRequirements.temperature}, Rainfall: ${storedAdvisory.weatherRequirements.rainfall}` : getLocalizedField(storedAdvisory.weatherInformation, sanitizedLang),
        fertilizerSuggestion: storedAdvisory.fertilizer?.recommendation || getLocalizedField(storedAdvisory.fertilizerSuggestion, sanitizedLang),
        waterTiming: storedAdvisory.irrigation?.timing || storedAdvisory.irrigation?.frequency || getLocalizedField(storedAdvisory.waterTiming, sanitizedLang),
        possibleDiseases: (storedAdvisory.diseases || storedAdvisory.possibleDiseases || []).map((d) =>
          typeof d === 'string' ? d : `${d.name || ''}: ${d.symptoms || d.prevention || ''}`
        ),
        precautions: (storedAdvisory.precautions || []).map((p) => (typeof p === 'string' ? p : p.name || p.en || 'Follow IPM guidelines'))
      };
    }

    // 4. Fallback fallback computation if stored advisory record not found
    let soilDoc = null;
    try {
      if (districtDoc._id && isValidObjectId(districtDoc._id)) {
        soilDoc = await Soil.findOne({ district: districtDoc._id });
      }
    } catch (err) {
      soilDoc = null;
    }

    if (!soilDoc) {
      const regionEn = districtDoc.region.en;
      const soilTemplate = soilTemplatesByRegion[regionEn] || soilTemplatesByRegion['Central Gujarat'];
      soilDoc = {
        soilType: soilTemplate.soilType,
        averagePH: soilTemplate.averagePH,
        npkInfo: soilTemplate.npkInfo
      };
    }

    const districtNameEn = districtDoc.districtName.en;
    const weatherData = await weatherService.getWeather(
      districtNameEn,
      districtDoc.coordinates?.latitude,
      districtDoc.coordinates?.longitude,
      sanitizedLang
    );

    return {
      district: getLocalizedField(districtDoc.districtName, sanitizedLang),
      crop: getLocalizedField(cropDoc.name, sanitizedLang),
      season: season,
      soilInformation: getLocalizedField(soilDoc.soilType, sanitizedLang),
      phLevel: soilDoc.averagePH,
      npkLevel: soilDoc.npkInfo || { nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'High' },
      weatherInformation: `${weatherData.condition} (${weatherData.temperature}, Humidity: ${weatherData.humidity})`,
      fertilizerSuggestion: `Apply balanced NPK for ${cropDoc.name.en} in ${districtDoc.districtName.en}.`,
      waterTiming: 'Irrigate at key crop growth stages.',
      possibleDiseases: ['Monitor crop weekly for pests and leaf spots.'],
      precautions: ['Conduct seed treatment before sowing.']
    };
  }
};
