import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import './common.css';

export const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="language-selector-wrapper">
      <Globe size={18} className="lang-icon" />
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
      >
        <option value="en">English</option>
        <option value="gu">ગુજરાતી</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  );
};
