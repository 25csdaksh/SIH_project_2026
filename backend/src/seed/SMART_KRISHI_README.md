# Smart Krishi Data Seeding & Rules Specification

This directory contains the dataset definitions, seed script, and database integration guidelines for the **Smart Krishi** module of KrishiSeva.

---

## Files Overview

1. `smartKrishiData.json`: Structured JSON file containing pre-configured advisory rules for Gujarat districts, crops, and seasons.
2. `seed.js`: Database seeding script that reads `smartKrishiData.json`, resolves object references for `District` and `Crop`, and populates the MongoDB `smartkrishis` collection.
3. `SMART_KRISHI_README.md`: Documentation for maintaining and extending Smart Krishi advisory rules.

---

## JSON Structure Specification (`smartKrishiData.json`)

Each entry in `smartKrishiData.json` represents a specific advisory rule for a combination of `districtCode`, `cropCode`, and `season`:

```json
{
  "districtCode": "AND",
  "cropCode": "cotton",
  "season": "kharif",
  "soilInformation": {
    "en": "Deep Goradu Fertile Loam Soil",
    "gu": "ઉંડી રસાળ ગોરાડુ જમીન",
    "hi": "गहरी उपजाऊ गोराडू मिट्टी"
  },
  "phLevel": 7.2,
  "npkLevel": {
    "nitrogen": "High",
    "phosphorus": "Medium",
    "potassium": "High"
  },
  "weatherInformation": {
    "en": "Monsoon / Moderate Humidity suitable for Cotton",
    "gu": "ચોમાસુ / કપાસ માટે અનુકૂળ હવામાન",
    "hi": "मानसून / कपास के लिए अनुकूल मौसम"
  },
  "fertilizerSuggestion": {
    "en": "Apply 120 kg N, 60 kg P2O5, and 60 kg K2O per hectare.",
    "gu": "હેક્ટર દીઠ ૧૨૦ કિગ્રા નાઇટ્રોજન, ૬૦ કિગ્રા ફોસ્ફરસ અને ૬૦ કિગ્રા પોટાશ આપવો.",
    "hi": "प्रति हेक्टेयर 120 किग्रा एन, 60 किग्रा पी और 60 किग्रा के दें।"
  },
  "waterTiming": {
    "en": "Irrigate at 15-20 days interval during vegetative growth.",
    "gu": "વૃદ્ધિના તબક્કે ૧૫-૨૦ દિવસે પિયત આપવું.",
    "hi": "वानस्पतिक वृद्धि के दौरान 15-20 दिनों के अंतराल पर सिंचाई करें।"
  },
  "possibleDiseases": [
    {
      "en": "Cotton Pink Bollworm & Sucking Pests",
      "gu": "કપાસની ગુલાબી ઈયળ અને મોલો-મશી",
      "hi": "कपास की गुलाबी सूंडी और माहू"
    }
  ],
  "precautions": [
    {
      "en": "Install 5 pheromone traps per acre for early bollworm detection.",
      "gu": "એકર દીઠ ૫ ફેરોમોન ટ્રેપ ગોઠવો.",
      "hi": "प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं।"
    }
  ]
}
```

---

## How to Add New Rules or Edit Existing Ones

1. Open `backend/src/seed/smartKrishiData.json`.
2. Add a new object following the schema above.
3. Ensure `districtCode` matches a valid district code in `districts.js` (e.g. `AND`, `RAJ`, `MEH`, `AMD`, `SUR`, `KUT`).
4. Ensure `cropCode` matches a valid crop code in `crops.js` (e.g. `cotton`, `paddy`, `wheat`, `groundnut`, `cumin`).
5. Ensure `season` is one of `kharif`, `rabi`, `summer`, `zaid`, or `annual`.

---

## Seeding MongoDB Atlas

Run the seeder script from the `backend/` directory:

```bash
cd backend
npm run seed
```

This will automatically drop existing records, validate references, and populate MongoDB Atlas with all datasets.
