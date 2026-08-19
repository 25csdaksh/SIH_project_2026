import axios from 'axios';
import { env } from '../config/env.js';
import { MandiRate } from '../models/MandiRate.js';
import { District } from '../models/District.js';
import { logger } from '../utils/logger.js';
import { getLocalizedField, localizeDoc } from '../utils/validators.js';

export const mandiService = {
  getRates: async ({ district = '', market = '', commodity = '', lang = 'en' }) => {
    try {
      // 1. Check live external mandi API if key is present
      if (env.mandiApiKey) {
        try {
          const params = {
            'api-key': env.mandiApiKey,
            format: 'json',
            limit: 20
          };
          if (district) params['filters[district]'] = district;
          if (commodity) params['filters[commodity]'] = commodity;

          const response = await axios.get(env.mandiApiUrl, { params, timeout: 5000 });
          if (response.data && response.data.records && response.data.records.length > 0) {
            return response.data.records.map((r) => ({
              market: r.market || market || 'APMC Market',
              district: r.district || district || 'Gujarat',
              commodity: r.commodity,
              variety: r.variety || 'Standard',
              minimumPrice: Number(r.min_price) || 0,
              maximumPrice: Number(r.max_price) || 0,
              modalPrice: Number(r.modal_price) || 0,
              arrivalDate: r.arrival_date || new Date().toISOString().split('T')[0]
            }));
          }
        } catch (apiErr) {
          logger.warn(`External Mandi API Call Failed: ${apiErr.message}. Falling back to Mandi database records.`);
        }
      }

      // 2. Query MongoDB Mandi Collection
      let filter = {};
      if (district) {
        const districtDoc = await District.findOne({
          $or: [
            { 'districtName.en': new RegExp(district, 'i') },
            { 'districtName.gu': new RegExp(district, 'i') },
            { 'districtName.hi': new RegExp(district, 'i') },
            { districtCode: district.toUpperCase() }
          ]
        });
        if (districtDoc) {
          filter.district = districtDoc._id;
        }
      }

      const rates = await MandiRate.find(filter).populate('district');

      if (!rates || rates.length === 0) {
        // Return structured default mandi rates
        const todayStr = new Date().toISOString().split('T')[0];
        const defaultRates = [
          {
            market: { en: 'Anand APMC Yard', gu: 'આણંદ માર્કેટ યાર્ડ', hi: 'आनंद मार्केट यार्ड' },
            district: district || 'Anand',
            commodity: { en: 'Cotton (Kapass)', gu: 'કપાસ', hi: 'कपास' },
            variety: 'Shankar-6',
            minimumPrice: 6900,
            maximumPrice: 7700,
            modalPrice: 7350,
            arrivalDate: todayStr
          },
          {
            market: { en: 'Gondal APMC Market', gu: 'ગોંડલ માર્કેટિંગ યાર્ડ', hi: 'गोंडल मार्केटिंग यार्ड' },
            district: district || 'Rajkot',
            commodity: { en: 'Groundnut (Magfali)', gu: 'મગફળી', hi: 'मूंगफली' },
            variety: 'Bold',
            minimumPrice: 5850,
            maximumPrice: 6800,
            modalPrice: 6350,
            arrivalDate: todayStr
          }
        ];
        return defaultRates.map(r => ({
          market: getLocalizedField(r.market, lang),
          district: typeof r.district === 'string' ? r.district : getLocalizedField(r.district.districtName, lang),
          commodity: getLocalizedField(r.commodity, lang),
          variety: r.variety,
          minimumPrice: r.minimumPrice,
          maximumPrice: r.maximumPrice,
          modalPrice: r.modalPrice,
          arrivalDate: r.arrivalDate
        }));
      }

      return rates.map((doc) => {
        const item = doc.toObject();
        return {
          market: getLocalizedField(item.market, lang),
          district: item.district ? getLocalizedField(item.district.districtName, lang) : district,
          commodity: getLocalizedField(item.commodity, lang),
          variety: item.variety,
          minimumPrice: item.minimumPrice,
          maximumPrice: item.maximumPrice,
          modalPrice: item.modalPrice,
          arrivalDate: item.arrivalDate
        };
      });
    } catch (error) {
      logger.error(`Mandi Service Error: ${error.message}`);
      throw error;
    }
  }
};
