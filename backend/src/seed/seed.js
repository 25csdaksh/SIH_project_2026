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
import { runSmartKrishiSeed } from './seedSmartKrishi.js';

import { districtsData } from './districts.js';
import { cropsData } from './crops.js';
import { soilTemplatesByRegion } from './soilData.js';
import { schemesData } from './schemes.js';

export const runSeed = async () => {
  let connected = false;
  const primaryUri = env.mongoUri;
  const fallbackLocalUri = 'mongodb://127.0.0.1:27017/krishiseva';

  try {
    logger.info(`Attempting MongoDB Atlas connection: ${primaryUri.split('@')[1] || 'Cluster'}...`);
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    connected = true;
    logger.info('Connected to MongoDB Atlas successfully!');
  } catch (atlasErr) {
    logger.warn(`MongoDB Atlas connection failed (${atlasErr.message}). Trying local MongoDB fallback...`);
    try {
      await mongoose.connect(fallbackLocalUri, { serverSelectionTimeoutMS: 3000 });
      connected = true;
      logger.info('Connected to Local MongoDB fallback successfully!');
    } catch (localErr) {
      logger.error('--------------------------------------------------------------------------------');
      logger.error('CRITICAL DATABASE CONNECTION ERROR:');
      logger.error('1. MongoDB Atlas IP Whitelist Issue: Your current IP address is not whitelisted on MongoDB Atlas.');
      logger.error('   Fix: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Click "Allow Access From Anywhere" (0.0.0.0/0).');
      logger.error('2. Local MongoDB Server Not Running.');
      logger.error('--------------------------------------------------------------------------------');
      process.exit(1);
    }
  }

  if (!connected) return;

  try {
    // Safe collections seed without dropping entire database
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
        commodity: { en: 'Cotton (Kapass)', gu: 'કપાસ', hi: 'કપાસ' },
        variety: 'Shankar-6',
        minimumPrice: 6800,
        maximumPrice: 7650,
        modalPrice: 7300,
        arrivalDate: todayStr
      },
      {
        district: districtMapByCode['AND'] || insertedDistricts[0]._id,
        market: { en: 'Anand APMC Main Yard', gu: 'આણંદ એપીએમસી મુખ્ય યાર્ડ', hi: 'आनंद एपीएमसी मुख्य यार्ड' },
        commodity: { en: 'Paddy (Dangar)', gu: 'ડાંગર', hi: 'ધાન' },
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
        market: { en: 'Unjha APMC Spice Market', gu: 'ઊંઝા એપીએમસી મસાલા માર્કેટ', hi: 'ऊँઝા એપીએમસી મસાલા માર્કેટ' },
        commodity: { en: 'Cumin (Jeera)', gu: 'જીરું', hi: 'જીરું' },
        variety: 'Quality No. 1',
        minimumPrice: 21500,
        maximumPrice: 27800,
        modalPrice: 24500,
        arrivalDate: todayStr
      }
    ];

    const insertedMandi = await MandiRate.insertMany(sampleMandiRates);
    logger.info(`Seeded ${insertedMandi.length} sample Mandi Rate records.`);

    // 6. Delegate to safe Smart Krishi seed logic
    await runSmartKrishiSeed();
  } catch (error) {
    logger.error(`Database Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runSeed();
}
