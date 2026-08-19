import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import './layout.css';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content flex-between">
        <div className="footer-left">
          <div className="footer-brand">
            <Sprout size={20} color="var(--primary-500)" />
            <span>{t('brand')}</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} KrishiSeva. Dedicated to Empowering Farmers of Gujarat & India.
          </p>
        </div>
        <div className="footer-right flex-center">
          <ShieldCheck size={16} color="var(--primary-500)" />
          <span>Verified Government & Agricultural Intelligence</span>
        </div>
      </div>
    </footer>
  );
};
