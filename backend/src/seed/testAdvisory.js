import mongoose from 'mongoose';
import dns from 'dns';
import { env } from '../config/env.js';
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

  console.log('\n--- TESTING SMART KRISHI DATABASE RECORDS ---\n');

  const sampleRecords = await SmartKrishi.find({}).limit(4);

  console.log(`Fetched ${sampleRecords.length} records from MongoDB SmartKrishi collection.\n`);

  for (const doc of sampleRecords) {
    console.log(`DistrictCode: ${doc.districtCode}`);
    console.log(`CropId: ${doc.cropId}`);
    console.log(`Season: ${doc.season}`);
    console.log(`DistrictName:`, doc.districtName);
    console.log(`CropName:`, doc.cropName);
    console.log(`Precautions (Multilingual Objects):`, doc.precautions.slice(0, 2));
    console.log(`Soil:`, doc.soil?.types);
    console.log(`Diseases:`, doc.diseases.slice(0, 1));
    console.log('-----------------------------------------------------\n');
  }

  const total = await SmartKrishi.countDocuments({});
  console.log(`Total SmartKrishi documents in MongoDB: ${total}\n`);

  process.exit(0);
};

runTests();
