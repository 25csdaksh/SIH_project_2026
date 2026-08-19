import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

import { District } from '../models/District.js';
import { Crop } from '../models/Crop.js';
import { Soil } from '../models/Soil.js';
import { GovernmentScheme } from '../models/GovernmentScheme.js';
import { MandiRate } from '../models/MandiRate.js';
import { SmartKrishi } from '../models/SmartKrishi.js';

import { districtsData } from './districts.js';
import { cropsData } from './crops.js';
import { soilTemplatesByRegion } from './soilData.js';
import { schemesData } from './schemes.js';

export const runSeed = async () => {
  try {
    logger.info('Connecting to MongoDB for database seeding...');
    await mongoose.connect(env.mongoUri);
    logger.info('Connected to MongoDB successfully.');

    // Drop database to clear old schema indexes
    logger.info('Dropping existing database collections and indexes...');
    await mongoose.connection.db.dropDatabase();
    logger.info('Database dropped cleanly.');

    // 1. Seed Districts
    logger.info('Seeding District records...');
    await District.deleteMany({});
    const insertedDistricts = await District.insertMany(districtsData);
    logger.info(`Seeded ${insertedDistricts.length} Gujarat Districts successfully.`);

    // Map District Code -> District ObjectId
    const districtMapByCode = {};
    insertedDistricts.forEach((d) => {
      districtMapByCode[d.districtCode] = d._id;
    });

    // 2. Seed Crops
    logger.info('Clearing old Crop records...');
    await Crop.deleteMany({});
    
    const cropsToInsert = cropsData.map((c) => {
      const suitableDistrictIds = (c.suitableDistrictCodes || [])
        .map((code) => districtMapByCode[code])
        .filter(Boolean);

      return {
        cropCode: c.cropCode,
        name: c.name,
        category: c.category,
        seasons: c.seasons,
        suitableDistricts: suitableDistrictIds
      };
    });

    const insertedCrops = await Crop.insertMany(cropsToInsert);
    logger.info(`Seeded ${insertedCrops.length} Crops with district relationships.`);

    // Map Crop Code -> Crop ObjectId
    const cropMapByCode = {};
    insertedCrops.forEach((c) => {
      cropMapByCode[c.cropCode] = c._id;
    });

    // 3. Seed Soil Data for each district
    logger.info('Clearing old Soil records...');
    await Soil.deleteMany({});

    const soilDocsToInsert = insertedDistricts.map((districtDoc) => {
      const regionNameEn = districtDoc.region.en;

      let template = soilTemplatesByRegion[regionNameEn];
      if (!template) {
        if (regionNameEn.includes('Saurashtra')) template = soilTemplatesByRegion['Saurashtra'];
        else if (regionNameEn.includes('South')) template = soilTemplatesByRegion['South Gujarat'];
        else if (regionNameEn.includes('North')) template = soilTemplatesByRegion['North Gujarat'];
        else if (regionNameEn.includes('Kutch')) template = soilTemplatesByRegion['Kutch'];
        else template = soilTemplatesByRegion['Central Gujarat'];
      }

      // Find crops suitable for this district
      const suitableCropIds = insertedCrops
        .filter((cropDoc) => cropDoc.suitableDistricts.some((id) => id.equals(districtDoc._id)))
        .map((cropDoc) => cropDoc._id);

      return {
        district: districtDoc._id,
        soilType: template.soilType,
        averagePH: template.averagePH,
        npkInfo: template.npkInfo,
        waterSources: template.waterSources,
        commonCrops: suitableCropIds,
        nearbyAPMCMarkets: template.nearbyAPMCMarkets
      };
    });

    const insertedSoils = await Soil.insertMany(soilDocsToInsert);
    logger.info(`Seeded ${insertedSoils.length} Soil records corresponding to all 33 districts.`);

    // 4. Seed Government Schemes
    logger.info('Clearing old GovernmentScheme records...');
    await GovernmentScheme.deleteMany({});
    const insertedSchemes = await GovernmentScheme.insertMany(schemesData);
    logger.info(`Seeded ${insertedSchemes.length} Government Schemes with verified links.`);

    // 5. Seed Initial Mandi Rates
    logger.info('Clearing old MandiRate records...');
    await MandiRate.deleteMany({});

    const todayStr = new Date().toISOString().split('T')[0];
    const sampleMandiRates = [
      {
        district: districtMapByCode['AND'] || insertedDistricts[0]._id,
        market: { en: 'Anand APMC Main Yard', gu: 'આણંદ એપીએમસી મુખ્ય યાર્ડ', hi: 'आनंद एपीएमसी मुख्य यार्ड' },
        commodity: { en: 'Cotton (Kapass)', gu: 'કપાસ', hi: 'कपास' },
        variety: 'Shankar-6',
        minimumPrice: 6800,
        maximumPrice: 7650,
        modalPrice: 7300,
        arrivalDate: todayStr
      },
      {
        district: districtMapByCode['AND'] || insertedDistricts[0]._id,
        market: { en: 'Anand APMC Main Yard', gu: 'આણંદ એપીએમસી મુખ્ય યાર્ડ', hi: 'आनंद एपीएमसी मुख्य यार्ड' },
        commodity: { en: 'Paddy (Dangar)', gu: 'ડાંગર', hi: 'धान' },
        variety: 'Gujarat-17',
        minimumPrice: 2100,
        maximumPrice: 2480,
        modalPrice: 2320,
        arrivalDate: todayStr
      },
      {
        district: districtMapByCode['RAJ'] || insertedDistricts[0]._id,
        market: { en: 'Gondal APMC Market', gu: 'ગોંડલ માર્કેટિંગ યાર્ડ', hi: 'गोंडल मार्केटिंग यार्ड' },
        commodity: { en: 'Groundnut (Magfali)', gu: 'મગફળી', hi: 'मूंगफली' },
        variety: 'Bold',
        minimumPrice: 5900,
        maximumPrice: 6850,
        modalPrice: 6400,
        arrivalDate: todayStr
      },
      {
        district: districtMapByCode['UNJ'] || districtMapByCode['MEH'] || insertedDistricts[0]._id,
        market: { en: 'Unjha APMC Spice Market', gu: 'ઊંઝા એપીએમસી મસાલા માર્કેટ', hi: 'ऊँझा एपीएमसी मसाला मंडी' },
        commodity: { en: 'Cumin (Jeera)', gu: 'જીરું', hi: 'जीरा' },
        variety: 'Quality No. 1',
        minimumPrice: 21500,
        maximumPrice: 27800,
        modalPrice: 24500,
        arrivalDate: todayStr
      }
    ];

    const insertedMandi = await MandiRate.insertMany(sampleMandiRates);
    logger.info(`Seeded ${insertedMandi.length} sample Mandi Rate records.`);

    // 6. Seed Smart Krishi JSON Data
    logger.info('Clearing old SmartKrishi records & reading smartKrishiData.json...');
    await SmartKrishi.deleteMany({});

    const jsonPath = path.resolve('src/seed/smartKrishiData.json');
    if (fs.existsSync(jsonPath)) {
      const rawJson = fs.readFileSync(jsonPath, 'utf8');
      const parsedData = JSON.parse(rawJson);

      let smartKrishiItems = [];

      if (Array.isArray(parsedData)) {
        smartKrishiItems = parsedData.map((item) => {
          const dId = districtMapByCode[item.districtCode] || insertedDistricts[0]._id;
          const cId = cropMapByCode[item.cropCode] || insertedCrops[0]._id;

          return {
            district: dId,
            crop: cId,
            season: item.season,
            soilInformation: item.soilInformation,
            phLevel: item.phLevel,
            npkLevel: item.npkLevel,
            weatherInformation: item.weatherInformation,
            fertilizerSuggestion: item.fertilizerSuggestion,
            waterTiming: item.waterTiming,
            possibleDiseases: item.possibleDiseases,
            precautions: item.precautions
          };
        });
      } else if (parsedData.districts && Array.isArray(parsedData.districts)) {
        // Flatten nested format: districts -> crops -> seasons
        parsedData.districts.forEach((d) => {
          const dCode = d.code ? d.code.replace('GJ-', '').toUpperCase() : '';
          const matchedDistrictId = insertedDistricts.find(
            (dist) => dist.districtCode === dCode || dist.districtName.toLowerCase().includes(d.name.toLowerCase())
          )?._id || insertedDistricts[0]._id;

          (d.crops || []).forEach((c) => {
            const matchedCropId = insertedCrops.find(
              (cr) => cr.cropCode === c.id || cr.name.toLowerCase() === c.name.toLowerCase()
            )?._id || insertedCrops[0]._id;

            (c.seasons || []).forEach((s) => {
              smartKrishiItems.push({
                district: matchedDistrictId,
                crop: matchedCropId,
                season: s.name.toLowerCase(),
                soilInformation: {
                  en: s.soil?.types?.join(', ') || 'Well drained soil',
                  gu: `${c.gujaratiName || c.name} માટે અનુકૂળ જમીન`,
                  hi: `${c.hindiName || c.name} के लिए उपयुक्त मिट्टी`
                },
                phLevel: parseFloat(s.soil?.phRange) || 7.0,
                npkLevel: {
                  nitrogen: s.soil?.nitrogen?.recommendedRange || 'Medium',
                  phosphorus: s.soil?.phosphorus?.recommendedRange || 'Medium',
                  potassium: s.soil?.potassium?.recommendedRange || 'Medium'
                },
                weatherInformation: {
                  en: `Temp: ${s.weatherRequirements?.temperature || '20-30°C'}, Rainfall: ${s.weatherRequirements?.rainfall || '500mm'}`,
                  gu: `તાપમાન: ${s.weatherRequirements?.temperature || '૨૦-૩૦°C'}, વરસાદ: ${s.weatherRequirements?.rainfall || '૫૦૦મીમી'}`,
                  hi: `तापमान: ${s.weatherRequirements?.temperature || '20-30°C'}, बारिश: ${s.weatherRequirements?.rainfall || '500मिमी'}`
                },
                fertilizerSuggestion: {
                  en: s.fertilizer?.recommendation || 'Apply balanced NPK as per soil test.',
                  gu: `${s.fertilizer?.recommendation || 'જમીન ચકાસણી મુજબ સમતોલ NPK આપવું.'}`,
                  hi: `${s.fertilizer?.recommendation || 'मिट्टी परीक्षण के अनुसार संतुलित एनपीके दें।'}`
                },
                waterTiming: {
                  en: s.irrigation?.timing || s.irrigation?.frequency || 'Irrigate at critical stages.',
                  gu: `${s.irrigation?.timing || 'મહત્વના તબક્કે પિયત આપવું.'}`,
                  hi: `${s.irrigation?.timing || 'महत्वपूर्ण चरणों पर सिंचाई करें।'}`
                },
                possibleDiseases: (s.diseases || []).map((dis) => ({
                  en: `${dis.name}: ${dis.symptoms || ''}`,
                  gu: `${dis.gujaratiName || dis.name}: ${dis.prevention || ''}`,
                  hi: `${dis.name}: ${dis.prevention || ''}`
                })),
                precautions: (s.precautions || []).map((p) => ({
                  en: typeof p === 'string' ? p : p.en || p.name || 'Follow IPM guidelines',
                  gu: typeof p === 'string' ? p : p.gu || 'યોગ્ય કાળજી લેવી',
                  hi: typeof p === 'string' ? p : p.hi || 'उचित सावधानी बरतें'
                }))
              });
            });
          });
        });
      }

      if (smartKrishiItems.length > 0) {
        const insertedSmartKrishi = await SmartKrishi.insertMany(smartKrishiItems);
        logger.info(`Seeded ${insertedSmartKrishi.length} Smart Krishi JSON advisory profiles into MongoDB Atlas.`);
      }
    } else {
      logger.warn('smartKrishiData.json not found, skipping JSON seed step.');
    }

    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Database Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runSeed();
}
