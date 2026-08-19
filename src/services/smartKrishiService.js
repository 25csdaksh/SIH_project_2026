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

    // 3. Strict Validation: Crop MUST belong to selected District
    const distCode = districtDoc.districtCode;
    let isCropInDistrict = false;
    if (cropDoc.suitableDistricts && Array.isArray(cropDoc.suitableDistricts) && cropDoc.suitableDistricts.length > 0 && isValidObjectId(cropDoc.suitableDistricts[0])) {
      isCropInDistrict = cropDoc.suitableDistricts.some((dId) => dId.equals(districtDoc._id));
    } else {
      isCropInDistrict = (cropDoc.suitableDistrictCodes || []).includes(distCode);
    }

    if (!isCropInDistrict) {
      const districtNameStr = getLocalizedField(districtDoc.districtName, sanitizedLang);
      const cropNameStr = getLocalizedField(cropDoc.name, sanitizedLang);
      const err = new Error(`Crop '${cropNameStr}' is not associated with '${districtNameStr}' district.`);
      err.statusCode = 400;
      throw err;
    }

    // 4. Strict Validation: Season MUST be valid for Crop
    const matchingSeason = cropDoc.seasons.find((s) => s.seasonCode.toLowerCase() === season.toLowerCase());
    if (!matchingSeason) {
      const cropNameStr = getLocalizedField(cropDoc.name, sanitizedLang);
      const err = new Error(`Season '${season}' is not suitable for crop '${cropNameStr}'. Valid seasons are: ${cropDoc.seasons.map(s => s.seasonCode).join(', ')}.`);
      err.statusCode = 400;
      throw err;
    }

    // 5. Fetch Soil Data for District
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

    // 6. Fetch Weather Data for District
    const districtNameEn = districtDoc.districtName.en;
    const weatherData = await weatherService.getWeather(
      districtNameEn,
      districtDoc.coordinates?.latitude,
      districtDoc.coordinates?.longitude,
      sanitizedLang
    );

    // 7. Generate Customized Agricultural Insights
    const cropNameEn = cropDoc.cropCode;

    const fertilizerMap = {
      cotton: {
        en: 'Apply 120 kg N, 60 kg P2O5, and 60 kg K2O per hectare. Apply Nitrogen in 3 equal splits: Basal, 30 DAP, and 60 DAP.',
        gu: 'હેક્ટર દીઠ ૧૨૦ કિગ્રા નાઇટ્રોજન, ૬૦ કિગ્રા ફોસ્ફરસ અને ૬૦ કિગ્રા પોટાશ આપવો. નાઇટ્રોજન ૩ હપ્તામાં આપવો.',
        hi: 'प्रति हेक्टेयर 120 किग्रा नाइट्रोजन, 60 किग्रा फास्फोरस और 60 किग्रा पोटाश दें।'
      },
      groundnut: {
        en: 'Apply 25 kg N, 50 kg P2O5, and 50 kg Gypsum per hectare at flowering stage for optimal pod development.',
        gu: 'હેક્ટર દીઠ ૨૫ કિગ્રા નાઇટ્રોજન, ૫૦ કિગ્રા ફોસ્ફરસ અને ફૂલ બેસતી વખતે ૫૦ કિગ્રા જીપ્સમ આપવું.',
        hi: 'प्रति हेक्टेयर 25 किग्रा एन, 50 किग्रा पी और फूल आने पर 50 किग्रा जिप्सम दें।'
      },
      wheat: {
        en: 'Apply 120 kg N and 60 kg P2O5 per hectare. Apply 50% N at sowing and remaining 50% at crown root initiation.',
        gu: 'હેક્ટર દીઠ ૧૨૦ કિગ્રા નાઇટ્રોજન અને ૬૦ કિગ્રા ફોસ્ફરસ આપવો. ૫૦% નાઇટ્રોજન વાવણી સમયે અને ૫૦% પિયત વખતે આપવું.',
        hi: 'प्रति हेक्टेयर 120 किग्रा एन और 60 किग्रा पी दें। 50% एन बुआई के समय और 50% पहली सिंचाई पर दें।'
      }
    };

    const waterMap = {
      cotton: {
        en: 'Irrigate at 15-20 days interval during vegetative growth. Ensure no waterlogging during flowering & boll formation.',
        gu: 'વૃદ્ધિના તબક્કે ૧૫-૨૦ દિવસે પિયત આપવું. ફૂલ અને ઝીંડવા વખતે ખેતરમાં પાણી ભરાઈ ન રહે તેનું ધ્યાન રાખવું.',
        hi: 'वानस्पतिक वृद्धि के दौरान 15-20 दिनों के अंतराल पर सिंचाई करें।'
      },
      groundnut: {
        en: 'Critical irrigation stages: Flowering, Pegging (30-35 DAP), and Pod development (50-60 DAP). Drip system recommended.',
        gu: 'મહત્વના પિયત તબક્કા: ફૂલ આવવા, સુયા બેસવા (૩૦-૩૫ દિવસે) અને ડોડવા વિકાસ વખતે. ટપક પદ્ધતિ ઉત્તમ.',
        hi: 'सिंचाई के मुख्य चरण: फूल आना, सुइयां बनना और फली विकास। टपका सिंचाई सर्वोत्तम।'
      },
      wheat: {
        en: '5 to 6 irrigations required: Crown Root Initiation (21 DAP), Tillering (40 DAP), Jointing (60 DAP), and Flowering (80 DAP).',
        gu: 'કુલ ૫ થી ૬ પિયત આપવા: મુકુટ મૂળ (૨૧ દિવસે), ફુટ (૪૦ દિવસે), ગાંઠ પડતી વખતે (૬૦ દિવસે) અને ફૂલ વખતે (૮૦ દિવસે).',
        hi: '5 से 6 सिंचाइयों की आवश्यकता: ताज जड़ बनने (21 दिन), कल्ले निकलने (40 दिन) पर।'
      }
    };

    const defaultFertilizer = {
      en: `Balanced NPK application suitable for ${cropDoc.name.en} in ${districtDoc.districtName.en} soil conditions based on soil test card.`,
      gu: `${districtDoc.districtName.gu} ની જમીન અને ${cropDoc.name.gu} ના પાક માટે જમીન ચકાસણી મુજબ સંતુલિત ખાતર આપવું.`,
      hi: `${districtDoc.districtName.hi} की मिट्टी और ${cropDoc.name.hi} के लिए संतुलित उर्वरक दें।`
    };

    const defaultWater = {
      en: `Irrigate depending on rainfall and soil moisture. Avoid over-watering during high humidity (${weatherData.humidity}).`,
      gu: `વરસાદ અને જમીનના ભેજ મુજબ પિયત આપવું. ભેજનું પ્રમાણ (${weatherData.humidity}) વધારે હોય ત્યારે વધુ પિયત ટાળવું.`,
      hi: `वर्षा और मिट्टी की नमी के आधार पर सिंचाई करें। अधिक आर्द्रता (${weatherData.humidity}) में अत्यधिक सिंचाई से बचें।`
    };

    const selectedFertilizer = fertilizerMap[cropNameEn] || defaultFertilizer;
    const selectedWater = waterMap[cropNameEn] || defaultWater;

    const possibleDiseasesList = [
      {
        en: `Leaf Spot & Sucking Pests (Aphids / Whitefly) in ${cropDoc.name.en}`,
        gu: `${cropDoc.name.gu} માં મોલો-મશી અને ટપકાનો રોગ`,
        hi: `${cropDoc.name.hi} में माहू/चेपा और धब्बा रोग`
      },
      {
        en: 'Root Rot / Damping off due to excess soil moisture',
        gu: 'જમીનમાં વધુ પડતા ભેજને કારણે સુકારો / મૂળનો સડો',
        hi: 'मिट्टी में अत्यधिक नमी के कारण जड़ सड़न'
      }
    ];

    const precautionsList = [
      {
        en: 'Conduct seed treatment with Trichoderma viride (10g/kg seed) before sowing.',
        gu: 'વાવણી પહેલા બિયારણને ટ્રાઇકોડર્મા વાયરાઇડ (૧૦ ગ્રામ/કિગ્રા) નો પટ આપવો.',
        hi: 'बुआई से पहले ट्राइकोडर्मा विरिडे (10 ग्राम/किग्रा) से बीज उपचार करें।'
      },
      {
        en: 'Monitor crop weekly for early pest detection and maintain field drainage.',
        gu: 'જીવાત નિરીક્ષણ દર અઠવાડિયે કરવું અને ખેતરમાં પાણીના નિકાલની વ્યવસ્થા રાખવી.',
        hi: 'कीटों की शीघ्र पहचान के लिए साप्ताहिक निरीक्षण करें और जल निकासी बनाए रखें।'
      }
    ];

    const advisoryObj = {
      district: getLocalizedField(districtDoc.districtName, sanitizedLang),
      crop: getLocalizedField(cropDoc.name, sanitizedLang),
      season: matchingSeason.name ? getLocalizedField(matchingSeason.name, sanitizedLang) : season,
      soilInformation: getLocalizedField(soilDoc.soilType, sanitizedLang),
      phLevel: soilDoc.averagePH,
      npkLevel: soilDoc.npkInfo || { nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'High' },
      weatherInformation: `${weatherData.condition} (${weatherData.temperature}, Humidity: ${weatherData.humidity})`,
      fertilizerSuggestion: getLocalizedField(selectedFertilizer, sanitizedLang),
      waterTiming: getLocalizedField(selectedWater, sanitizedLang),
      possibleDiseases: possibleDiseasesList.map((item) => getLocalizedField(item, sanitizedLang)),
      precautions: precautionsList.map((item) => getLocalizedField(item, sanitizedLang))
    };

    return advisoryObj;
  }
};
