import mongoose from 'mongoose';
import dns from 'dns';
import { env } from '../config/env.js';
import { smartKrishiService } from '../services/smartKrishiService.js';
import { SmartKrishi } from '../models/SmartKrishi.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const runTests = async () => {
  const primaryUri = env.mongoUri;
  const fallbackLocalUri = 'mongodb://127.0.0.1:27017/krishiseva';
  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
  } catch (e) {
    await mongoose.connect(fallbackLocalUri, { serverSelectionTimeoutMS: 3000 });
  }

  console.log('\n====================================================');
  console.log('RUNNING SMART KRISHI ADVISORY INTEGRATION TESTS');
  console.log('====================================================\n');

  const testCases = [
    { districtId: 'RAJ', cropId: 'groundnut', season: 'kharif', title: 'Rajkot → Groundnut → Kharif' },
    { districtId: 'RAJ', cropId: 'groundnut', season: 'summer', title: 'Rajkot → Groundnut → Summer' },
    { districtId: 'RAJ', cropId: 'cotton', season: 'kharif', title: 'Rajkot → Cotton → Kharif' }
  ];

  for (const tc of testCases) {
    try {
      const advisory = await smartKrishiService.generateAdvisory({
        districtId: tc.districtId,
        cropId: tc.cropId,
        season: tc.season,
        language: 'en'
      });

      console.log(`✅ TEST: ${tc.title}`);
      console.log(`   - District: ${advisory.district}`);
      console.log(`   - Crop: ${advisory.crop}`);
      console.log(`   - Season: ${advisory.season}`);
      console.log(`   - Soil: ${advisory.soilInformation}`);
      console.log(`   - pH: ${advisory.phLevel}`);
      console.log(`   - Weather: ${advisory.weatherInformation}`);
      console.log(`   - Fertilizer: ${advisory.fertilizerSuggestion.substring(0, 70)}...`);
      console.log(`   - Water Timing: ${advisory.waterTiming.substring(0, 70)}...`);
      console.log(`   - Diseases: ${advisory.possibleDiseases ? advisory.possibleDiseases[0] : 'None'}`);
      console.log(`   - Precautions: ${advisory.precautions ? advisory.precautions[0] : 'None'}`);
      console.log('----------------------------------------------------\n');
    } catch (err) {
      console.error(`❌ TEST FAILED: ${tc.title} - ${err.message}\n`);
    }
  }

  const finalDocs = await SmartKrishi.countDocuments({});
  console.log(`Final SmartKrishi documents in MongoDB: ${finalDocs}\n`);
  process.exit(0);
};

runTests();
