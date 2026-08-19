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
import { SmartKrishi } from '../models/SmartKrishi.js';

import { districtsData } from './districts.js';
import { cropsData } from './crops.js';

export const runSmartKrishiSeed = async () => {
  const jsonRelativePath = 'src/seed/smartKrishiData.json';
  const jsonPath = path.resolve(jsonRelativePath);

  console.log('\nSmart Krishi Import Started\n');
  console.log('Source:');
  console.log(jsonRelativePath);

  if (!fs.existsSync(jsonPath)) {
    console.error(`ERROR: File not found at ${jsonPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf8');
  let parsedData = null;
  try {
    parsedData = JSON.parse(fileContent);
  } catch (err) {
    console.error(`ERROR: Failed to parse JSON: ${err.message}`);
    process.exit(1);
  }

  console.log('Top-level keys in JSON:', Object.keys(parsedData));

  let districtsInJson = [];
  if (Array.isArray(parsedData)) {
    districtsInJson = parsedData;
  } else if (parsedData.districts && Array.isArray(parsedData.districts)) {
    districtsInJson = parsedData.districts;
  }

  const districtsCount = districtsInJson.length;
  const distinctCropsSet = new Set();
  let districtCropCombinations = 0;
  let districtCropSeasonRecords = 0;

  districtsInJson.forEach((d) => {
    (d.crops || []).forEach((c) => {
      distinctCropsSet.add(c.id || c.name);
      districtCropCombinations++;
      districtCropSeasonRecords += (c.seasons || []).length;
    });
  });

  console.log(`Districts detected: ${districtsCount}`);
  console.log(`Distinct crops detected: ${distinctCropsSet.size}`);
  console.log(`District-crop combinations: ${districtCropCombinations}`);
  console.log(`District-crop-season records: ${districtCropSeasonRecords}\n`);

  // Connect to MongoDB safely without dropping database
  const primaryUri = env.mongoUri;
  const fallbackLocalUri = 'mongodb://127.0.0.1:27017/krishiseva';
  let connected = false;

  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    connected = true;
  } catch (atlasErr) {
    try {
      await mongoose.connect(fallbackLocalUri, { serverSelectionTimeoutMS: 3000 });
      connected = true;
    } catch (localErr) {
      console.error('ERROR: Could not connect to MongoDB Atlas or Local MongoDB.');
      process.exit(1);
    }
  }

  if (!connected) process.exit(1);

  // Existing count in MongoDB
  const existingCount = await SmartKrishi.countDocuments({});

  // Ensure Districts and Crops exist in DB for ObjectId reference resolution
  let dbDistricts = await District.find({});
  if (dbDistricts.length === 0) {
    dbDistricts = await District.insertMany(districtsData);
  }

  let dbCrops = await Crop.find({});
  if (dbCrops.length === 0) {
    dbCrops = await Crop.insertMany(
      cropsData.map((c) => ({
        cropCode: c.cropCode,
        name: c.name,
        category: c.category,
        seasons: c.seasons
      }))
    );
  }

  const getDistrictNameStr = (distDoc) => {
    if (!distDoc || !distDoc.districtName) return '';
    if (typeof distDoc.districtName === 'string') return distDoc.districtName.toLowerCase();
    return (distDoc.districtName.en || distDoc.districtName.gu || distDoc.districtName.hi || '').toLowerCase();
  };

  const getCropNameStr = (cropDoc) => {
    if (!cropDoc || !cropDoc.name) return '';
    if (typeof cropDoc.name === 'string') return cropDoc.name.toLowerCase();
    return (cropDoc.name.en || cropDoc.name.gu || cropDoc.name.hi || '').toLowerCase();
  };

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;

  for (const d of districtsInJson) {
    const rawDistrictCode = d.code || d.districtCode || '';
    const dCodeShort = rawDistrictCode.replace('GJ-', '').toUpperCase();
    let districtDoc = dbDistricts.find((dist) => dist.districtCode === dCodeShort || dist.districtCode === rawDistrictCode);

    if (!districtDoc && d.name) {
      districtDoc = dbDistricts.find((dist) => {
        const nameStr = getDistrictNameStr(dist);
        return nameStr && nameStr.includes(d.name.toLowerCase());
      });
    }

    if (!districtDoc) {
      districtDoc = dbDistricts[0];
    }

    for (const c of d.crops || []) {
      const rawCropId = c.id || c.cropCode || c.cropId || '';
      let cropDoc = dbCrops.find((cr) => cr.cropCode === rawCropId);

      if (!cropDoc && c.name) {
        cropDoc = dbCrops.find((cr) => {
          const crNameStr = getCropNameStr(cr);
          return crNameStr && crNameStr.includes(c.name.toLowerCase());
        });
      }

      if (!cropDoc) {
        cropDoc = dbCrops[0];
      }

      for (const s of c.seasons || []) {
        const seasonName = (s.name || s.season || 'Kharif').toLowerCase();

        // Safely format precautions array as multilingual objects
        const formattedPrecautions = (s.precautions || []).map((p) => {
          if (typeof p === 'string') {
            return { en: p, gu: p, hi: p };
          }
          if (typeof p === 'object' && p !== null) {
            return {
              en: p.en || p.name || p.title || '',
              gu: p.gu || p.name || p.title || '',
              hi: p.hi || p.name || p.title || ''
            };
          }
          return { en: String(p), gu: String(p), hi: String(p) };
        });

        // Safely format diseases array
        const formattedDiseases = (s.diseases || []).map((dis) => ({
          name: dis.name || '',
          gujaratiName: dis.gujaratiName || '',
          symptoms: dis.symptoms || '',
          prevention: dis.prevention || '',
          management: dis.management || '',
          riskConditions: dis.riskConditions || ''
        }));

        // Safely format pests array
        const formattedPests = (s.pests || []).map((pst) => ({
          name: pst.name || '',
          gujaratiName: pst.gujaratiName || '',
          symptoms: pst.symptoms || '',
          prevention: pst.prevention || '',
          management: pst.management || '',
          riskConditions: pst.riskConditions || ''
        }));

        const query = {
          district: districtDoc._id,
          crop: cropDoc._id,
          season: seasonName
        };

        const updateDoc = {
          $set: {
            district: districtDoc._id,
            districtCode: rawDistrictCode || districtDoc.districtCode,
            districtName: {
              en: d.name || districtDoc.districtName.en,
              gu: d.gujaratiName || districtDoc.districtName.gu,
              hi: d.hindiName || districtDoc.districtName.hi
            },
            crop: cropDoc._id,
            cropId: rawCropId || cropDoc.cropCode,
            cropName: {
              en: c.name || cropDoc.name.en,
              gu: c.gujaratiName || cropDoc.name.gu,
              hi: c.hindiName || cropDoc.name.hi
            },
            season: seasonName,
            soil: s.soil || {},
            phLevel: parseFloat(s.soil?.phRange) || 7.0,
            npkLevel: {
              nitrogen: s.soil?.nitrogen?.recommendedRange || 'Medium',
              phosphorus: s.soil?.phosphorus?.recommendedRange || 'Medium',
              potassium: s.soil?.potassium?.recommendedRange || 'Medium'
            },
            weatherRequirements: s.weatherRequirements || {},
            fertilizer: s.fertilizer || {},
            irrigation: s.irrigation || {},
            diseases: formattedDiseases,
            pests: formattedPests,
            precautions: formattedPrecautions,
            sources: s.sources || [],
            metadata: {
              version: parsedData.version || '1.0',
              state: parsedData.state || 'Gujarat',
              lastUpdated: parsedData.lastUpdated || '2026-08-19',
              description: parsedData.meta?.description || '',
              dataSourceMethodology: parsedData.meta?.dataSourceMethodology || ''
            },
            soilInformation: {
              en: s.soil?.types?.join(', ') || 'Well-drained soil',
              gu: `${c.gujaratiName || c.name} માટે અનુકૂળ જમીન`,
              hi: `${c.hindiName || c.name} के लिए उपयुक्त मिट्टी`
            },
            weatherInformation: {
              en: `Temp: ${s.weatherRequirements?.temperature || '20-35°C'}, Rainfall: ${s.weatherRequirements?.rainfall || '500-1000 mm'}`,
              gu: `તાપમાન: ${s.weatherRequirements?.temperature || '૨૦-૩૫°C'}, વરસાદ: ${s.weatherRequirements?.rainfall || '૫૦૦-૧૦૦૦ મીમી'}`,
              hi: `तापमान: ${s.weatherRequirements?.temperature || '20-35°C'}, वर्षा: ${s.weatherRequirements?.rainfall || '500-1000 मिमी'}`
            },
            fertilizerSuggestion: {
              en: s.fertilizer?.recommendation || 'Apply balanced NPK as per soil testing.',
              gu: s.fertilizer?.recommendation || 'જમીન ચકાસણી મુજબ સમતોલ NPK આપવું.',
              hi: s.fertilizer?.recommendation || 'मिट्टी परीक्षण के अनुसार संतुलित एनपीके दें।'
            },
            waterTiming: {
              en: s.irrigation?.timing || s.irrigation?.frequency || 'Irrigate at critical stages.',
              gu: s.irrigation?.timing || 'મહત્વના તબક્કે પિયત આપવું.',
              hi: s.irrigation?.timing || 'महत्वपूर्ण चरणों पर सिंचाई करें।'
            },
            possibleDiseases: formattedDiseases.map((dis) => ({
              en: `${dis.name}: ${dis.symptoms || ''}`,
              gu: `${dis.gujaratiName || dis.name}: ${dis.prevention || ''}`,
              hi: `${dis.name}: ${dis.prevention || ''}`
            })),
            rawJson: s
          }
        };

        const result = await SmartKrishi.updateOne(query, updateDoc, { upsert: true });
        if (result.upsertedCount > 0) {
          insertedCount++;
        } else if (result.modifiedCount > 0) {
          updatedCount++;
        } else {
          skippedCount++;
        }
      }
    }
  }

  const finalCount = await SmartKrishi.countDocuments({});

  console.log('MongoDB:');
  console.log(`Existing SmartKrishi records: ${existingCount}`);
  console.log(`Inserted: ${insertedCount}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Duplicates: ${duplicateCount}`);
  console.log(`Final MongoDB SmartKrishi Count: ${finalCount}\n`);

  console.log('Smart Krishi import completed successfully.\n');
  process.exit(0);
};

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runSmartKrishiSeed();
}
