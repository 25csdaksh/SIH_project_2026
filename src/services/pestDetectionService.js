import { uploadToCloudinary } from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

/**
 * Pest Detection Service
 * Analyzes crop image and provides disease diagnostics with recommended treatment.
 * Modular design allowing easy integration of custom AI/ML model inference later.
 */
export const pestDetectionService = {
  analyzeImage: async (filePath, language = 'en') => {
    logger.info(`Analyzing pest detection image at path: ${filePath}`);

    // Upload to Cloudinary if configured
    const uploadResult = await uploadToCloudinary(filePath);

    // Diagnostic dataset for pest & disease identification
    const commonDiseases = [
      {
        diseaseName: {
          en: 'Cotton Pink Bollworm (Pectinophora gossypiella)',
          gu: 'કપાસની ગુલાબી ઈયળ',
          hi: 'कपास की गुलाबी सूंडी'
        },
        confidence: 94.5,
        description: {
          en: 'Pink bollworm larvae burrow into cotton bolls, damaging seeds and lint quality.',
          gu: 'ગુલાબી ઈયળ કપાસના ઝીંડવામાં પેસીને બીજ અને રૂની ગુણવત્તાને નુકસાન પહોંચાડે છે.',
          hi: 'गुलाबी सूंडी कपास के रोंए में घुसकर बीज और रुई की गुणवत्ता को नुकसान पहुंचाती है।'
        },
        recommendedAction: {
          en: 'Install pheromone traps @ 5 per acre. Spray Neem oil (1500 ppm) or Chlorantraniliprole 18.5% SC.',
          gu: 'એકર દીઠ ૫ ફેરોમોન ટ્રેપ ગોઠવો. લીમડાનું તેલ (૧૫૦૦ પીપીએમ) અથવા ક્લોરાન્ટ્રાનિલિપ્રોલ છંટકાવ કરો.',
          hi: 'प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। नीम का तेल (1500 पीपीएम) या क्लोरेंट्रानिलिप्रोले का छिड़काव करें।'
        },
        prevention: {
          en: 'Adopt crop rotation with non-host crops and avoid extending cotton season beyond January.',
          gu: 'પાક ફેરબદલી કરો અને જાન્યુઆરી પછી કપાસનો પાક ચાલુ ન રાખવો.',
          hi: 'फसल चक्र अपनाएं और जनवरी के बाद कपास की फसल न खींचें।'
        }
      },
      {
        diseaseName: {
          en: 'Groundnut Leaf Spot (Tikka Disease / Cercospora)',
          gu: 'મગફળીનો ટપકાનો રોગ (ટીક્કા)',
          hi: 'मूंगफली का टिक्का रोग'
        },
        confidence: 91.2,
        description: {
          en: 'Circular dark brown leaf spots surrounded by yellow halo leading to premature leaf fall.',
          gu: 'પાન પર ઘેરા બદામી ટપકાં અને પીળી ધાર જોવા મળે છે જેથી પાંદડાં અકાળે ખરી પડે છે.',
          hi: 'पत्तियों पर काले-भूरे धब्बे और पीला घेरा बनता है जिससे पत्तियां समय से पहले गिर जाती हैं।'
        },
        recommendedAction: {
          en: 'Spray Mancozeb 75% WP (2g/L) or Carbendazim 50% WP (1g/L) at 15-day intervals.',
          gu: 'મેન્કોઝેબ ૭૫% ડબલ્યુપી (૨ ગ્રામ/લીટર) અથવા કાર્બેન્ડાઝીમ (૧ ગ્રામ/લીટર) નો ૧૫ દિવસે છંટકાવ કરો.',
          hi: 'मैनकोजेब 75% डब्लूपी (2 ग्राम/लीटर) या कार्बेन्डाजिम (1 ग्राम/लीटर) का 15 दिनों के अंतराल पर छिड़काव करें।'
        },
        prevention: {
          en: 'Use certified disease-resistant seeds and avoid excessive overhead irrigation.',
          gu: 'પ્રમાણિત રોગપ્રતિકારક બિયારણ વાપરો અને ઓવરહેડ સિંચાઈ ટાળો.',
          hi: 'प्रमाणित रोग-प्रतिरोधी बीजों का प्रयोग करें और अत्यधिक ऊपरी सिंचाई से बचें।'
        }
      },
      {
        diseaseName: {
          en: 'Wheat Yellow / Stripe Rust (Puccinia striiformis)',
          gu: 'ઘઉંનો પીળો ગેરુ (સ્ટ્રાઇપ રસ્ટ)',
          hi: 'गेहूं का पीला रतुआ'
        },
        confidence: 89.8,
        description: {
          en: 'Yellow pustules arranged in linear stripes along the leaf blades in humid cool weather.',
          gu: 'ઠંડા હવામાનમાં પાંદડા પર લાઈનમાં પીળા રંગના પાવડર જેવા ટપકાં દેખાય છે.',
          hi: 'ठंडे मौसम में पत्तियों पर रेखाओं में पीले रंग की पुस्तिकाएं दिखाई देती हैं।'
        },
        recommendedAction: {
          en: 'Spray Propiconazole 25% EC (1 ml per liter of water) immediately upon detection.',
          gu: 'રોગ દેખાતા જપ્રોપીકોનાઝોલ ૨૫% ઈસી (૧ મિલી પ્રતિ લીટર પાણી) નો છંટકાવ કરવો.',
          hi: 'लक्षण दिखते ही प्रोपिकोनाज़ोल 25% ईसी (1 मिली प्रति लीटर पानी) का छिड़काव करें।'
        },
        prevention: {
          en: 'Sow recommended resistant varieties such as HD-2967 or GW-451.',
          gu: 'એચડી-૨૯૬૭ અથવા જીડબલ્યુ-૪૫૧ જેવી રોગપ્રતિકારક જાતો વાવવી.',
          hi: 'एचडी-2967 या जीडब्ल्यू-451 जैसी प्रतिरोधी किस्मों की बुआई करें।'
        }
      }
    ];

    // Pick analysis result deterministically or mock ML model result
    const selected = commonDiseases[0];

    return {
      imageUrl: uploadResult.secure_url || filePath,
      diseaseName: selected.diseaseName,
      confidence: selected.confidence,
      description: selected.description,
      recommendedAction: selected.recommendedAction,
      prevention: selected.prevention
    };
  }
};
