import React, { createContext, useState, useEffect } from 'react';
import en from '../i18n/en';
import gu from '../i18n/gu';
import hi from '../i18n/hi';

const translations = { en, gu, hi };

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('krishiseva_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('krishiseva_lang', language);
  }, [language]);

  const changeLanguage = (lang) => {
    if (['en', 'gu', 'hi'].includes(lang)) {
      setLanguage(lang);
    }
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language] || translations.en;
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
