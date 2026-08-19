import mongoose from 'mongoose';

export const SUPPORTED_LANGUAGES = ['en', 'gu', 'hi'];
export const DEFAULT_LANGUAGE = 'en';

export const sanitizeLanguage = (lang) => {
  if (!lang || typeof lang !== 'string') return DEFAULT_LANGUAGE;
  const lower = lang.toLowerCase().trim();
  return SUPPORTED_LANGUAGES.includes(lower) ? lower : DEFAULT_LANGUAGE;
};

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const getLocalizedField = (fieldObj, lang = 'en') => {
  if (!fieldObj) return '';
  if (typeof fieldObj === 'string') return fieldObj;
  const sanitizedLang = sanitizeLanguage(lang);
  return fieldObj[sanitizedLang] || fieldObj.en || fieldObj.gu || fieldObj.hi || '';
};

export const localizeDoc = (doc, lang = 'en') => {
  if (!doc) return null;
  const raw = doc.toObject ? doc.toObject() : { ...doc };
  
  const localized = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value && typeof value === 'object' && ('en' in value || 'gu' in value || 'hi' in value)) {
      localized[key] = getLocalizedField(value, lang);
    } else if (Array.isArray(value)) {
      localized[key] = value.map(item => {
        if (item && typeof item === 'object' && ('en' in item || 'gu' in item || 'hi' in item)) {
          return getLocalizedField(item, lang);
        }
        return item;
      });
    } else {
      localized[key] = value;
    }
  }
  return localized;
};
