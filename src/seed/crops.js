export const cropsData = [
  {
    cropCode: 'cotton',
    name: { en: 'Cotton', gu: 'કપાસ', hi: 'कपास' },
    category: 'cash_crop',
    seasons: [
      {
        seasonCode: 'kharif',
        name: { en: 'Kharif (Monsoon)', gu: 'ચોમાસુ (ખરીફ)', hi: 'खरीफ (मानसून)' },
        idealMonths: { en: 'June to November', gu: 'જૂન થી નવેમ્બર', hi: 'जून से नवंबर' }
      }
    ],
    suitableDistrictCodes: ['AMD', 'AMR', 'AND', 'BAN', 'BHR', 'BHV', 'BOT', 'JAM', 'JUN', 'KHE', 'KUT', 'MEH', 'MOR', 'PAT', 'RAJ', 'SAB', 'SUD', 'VAD']
  },
  {
    cropCode: 'groundnut',
    name: { en: 'Groundnut', gu: 'મગફળી', hi: 'मूंगफली' },
    category: 'oilseed',
    seasons: [
      {
        seasonCode: 'kharif',
        name: { en: 'Kharif (Monsoon)', gu: 'ચોમાસુ (ખરીફ)', hi: 'खरीफ (मानसून)' },
        idealMonths: { en: 'June to October', gu: 'જૂન થી ઓક્ટોબર', hi: 'जून से अक्टूबर' }
      },
      {
        seasonCode: 'summer',
        name: { en: 'Summer (Zaid)', gu: 'ઉનાળુ (ઝાઈદ)', hi: 'ग्रीष्मकालीन (जायद)' },
        idealMonths: { en: 'February to May', gu: 'ફેબ્રુઆરી થી મે', hi: 'फरवरी से मई' }
      }
    ],
    suitableDistrictCodes: ['AMR', 'BHV', 'BOT', 'DEV', 'GIR', 'JAM', 'JUN', 'MOR', 'POR', 'RAJ', 'SUD', 'KUT', 'BAN']
  },
  {
    cropCode: 'wheat',
    name: { en: 'Wheat', gu: 'ઘઉં', hi: 'गेहूं' },
    category: 'grain',
    seasons: [
      {
        seasonCode: 'rabi',
        name: { en: 'Rabi (Winter)', gu: 'શિયાળુ (રવી)', hi: 'रबी (शीतकालीन)' },
        idealMonths: { en: 'November to March', gu: 'નવેમ્બર થી માર્ચ', hi: 'नवंबर से मार्च' }
      }
    ],
    suitableDistrictCodes: ['AMD', 'AND', 'ARV', 'BAN', 'GND', 'KHE', 'MEH', 'PAT', 'SAB', 'VAD', 'BHV', 'RAJ', 'SUD']
  },
  {
    cropCode: 'paddy',
    name: { en: 'Paddy / Rice', gu: 'ડાંગર / ચોખા', hi: 'धान / चावल' },
    category: 'grain',
    seasons: [
      {
        seasonCode: 'kharif',
        name: { en: 'Kharif (Monsoon)', gu: 'ચોમાસુ (ખરીફ)', hi: 'खरीफ (मानसून)' },
        idealMonths: { en: 'June to November', gu: 'જૂન થી નવેમ્બર', hi: 'जून से नवंबर' }
      }
    ],
    suitableDistrictCodes: ['AND', 'BHR', 'CHU', 'DAH', 'DNG', 'KHE', 'NAR', 'NAV', 'PAN', 'SUR', 'TAP', 'VAD', 'VAL']
  },
  {
    cropCode: 'castor',
    name: { en: 'Castor', gu: 'એરંડા', hi: 'अरंडी' },
    category: 'oilseed',
    seasons: [
      {
        seasonCode: 'kharif',
        name: { en: 'Kharif (Monsoon)', gu: 'ચોમાસુ (ખરીફ)', hi: 'खरीफ (मानसून)' },
        idealMonths: { en: 'August to February', gu: 'ઓગસ્ટ થી ફેબ્રુઆરી', hi: 'अगस्त से फरवरी' }
      }
    ],
    suitableDistrictCodes: ['BAN', 'MEH', 'PAT', 'SAB', 'ARV', 'KUT', 'GND', 'KHE', 'AMD']
  },
  {
    cropCode: 'mustard',
    name: { en: 'Mustard', gu: 'રાઈ', hi: 'सरसों' },
    category: 'oilseed',
    seasons: [
      {
        seasonCode: 'rabi',
        name: { en: 'Rabi (Winter)', gu: 'શિયાળુ (રવી)', hi: 'रबी (शीतकालीन)' },
        idealMonths: { en: 'October to February', gu: 'ઓક્ટોબર થી ફેબ્રુઆરી', hi: 'अक्टूबर से फरवरी' }
      }
    ],
    suitableDistrictCodes: ['BAN', 'PAT', 'MEH', 'SAB', 'ARV']
  },
  {
    cropCode: 'cumin',
    name: { en: 'Cumin (Jeera)', gu: 'જીરું', hi: 'जीरा' },
    category: 'spice',
    seasons: [
      {
        seasonCode: 'rabi',
        name: { en: 'Rabi (Winter)', gu: 'શિયાળુ (રવી)', hi: 'रबी (शीतकालीन)' },
        idealMonths: { en: 'November to February', gu: 'નવેમ્બર થી ફેબ્રુઆરી', hi: 'नवंबर से फरवरी' }
      }
    ],
    suitableDistrictCodes: ['BAN', 'PAT', 'MEH', 'KUT', 'SUD', 'RAJ', 'JAM', 'BOT', 'MOR']
  },
  {
    cropCode: 'bajra',
    name: { en: 'Pearl Millet (Bajra)', gu: 'બાજરી', hi: 'बाजरा' },
    category: 'grain',
    seasons: [
      {
        seasonCode: 'kharif',
        name: { en: 'Kharif (Monsoon)', gu: 'ચોમાસુ (ખરીફ)', hi: 'खरीफ (मानसून)' },
        idealMonths: { en: 'June to September', gu: 'જૂન થી સપ્ટેમ્બર', hi: 'जून से सितंबर' }
      },
      {
        seasonCode: 'summer',
        name: { en: 'Summer (Zaid)', gu: 'ઉનાળુ (ઝાઈદ)', hi: 'ग्रीष्मकालीन (जायद)' },
        idealMonths: { en: 'March to June', gu: 'માર્ચ થી જૂન', hi: 'मार्च से जून' }
      }
    ],
    suitableDistrictCodes: ['BAN', 'PAT', 'MEH', 'SUD', 'KUT', 'AMD', 'BHV', 'ARV']
  },
  {
    cropCode: 'sugarcane',
    name: { en: 'Sugarcane', gu: 'શેરડી', hi: 'गन्ना' },
    category: 'cash_crop',
    seasons: [
      {
        seasonCode: 'annual',
        name: { en: 'Annual (All Season)', gu: 'વાર્ષિક', hi: 'वार्षिक' },
        idealMonths: { en: 'October to October (12 Months)', gu: 'ઓક્ટોબર થી ઓક્ટોબર (૧૨ મહિના)', hi: 'अक्टूबर से अक्टूबर' }
      }
    ],
    suitableDistrictCodes: ['SUR', 'NAV', 'VAL', 'TAP', 'NAR', 'BHR', 'JUN', 'GIR']
  },
  {
    cropCode: 'potato',
    name: { en: 'Potato', gu: 'બટાટા', hi: 'आलू' },
    category: 'vegetable',
    seasons: [
      {
        seasonCode: 'rabi',
        name: { en: 'Rabi (Winter)', gu: 'શિયાળુ (રવી)', hi: 'रबी (शीतकालीन)' },
        idealMonths: { en: 'November to February', gu: 'નવેમ્બર થી ફેબ્રુઆરી', hi: 'नवंबर से फरवरी' }
      }
    ],
    suitableDistrictCodes: ['BAN', 'SAB', 'ARV', 'KHE', 'AND']
  },
  {
    cropCode: 'mango',
    name: { en: 'Mango (Kesar / Alphonso)', gu: 'કેરી (કેસર / આફુસ)', hi: 'आम (केसर / अल्फांसो)' },
    category: 'fruit',
    seasons: [
      {
        seasonCode: 'summer',
        name: { en: 'Summer', gu: 'ઉનાળો', hi: 'ग्रीष्म' },
        idealMonths: { en: 'March to June', gu: 'માર્ચ થી જૂન', hi: 'मार्च से जून' }
      }
    ],
    suitableDistrictCodes: ['JUN', 'GIR', 'VAL', 'NAV', 'SUR', 'AMR', 'BHV']
  },
  {
    cropCode: 'banana',
    name: { en: 'Banana', gu: 'કેળા', hi: 'केला' },
    category: 'fruit',
    seasons: [
      {
        seasonCode: 'annual',
        name: { en: 'Annual', gu: 'વાર્ષિક', hi: 'वार्षिक' },
        idealMonths: { en: 'June to July planting', gu: 'જૂન થી જુલાઈ રોપણી', hi: 'जून से जुलाई रोपण' }
      }
    ],
    suitableDistrictCodes: ['AND', 'KHE', 'VAD', 'BHR', 'SUR', 'NAV']
  }
];
