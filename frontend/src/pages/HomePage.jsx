import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, ShieldCheck, MapPin, Sparkles, CloudSun, TrendingUp, Landmark, MessageSquareText, Bug } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import '../styles/global.css';

export const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-500)', borderRadius: '20px', fontWeight: '600', marginBottom: '16px' }}>
          <Sprout size={18} /> KrishiSeva Platform
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>
          {t('home.heroTitle')}
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
          {t('home.heroSubtitle')}
        </p>
        <Link to="/dashboard" className="btn btn-primary btn-medium" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
          {t('home.getStarted')} <ArrowRight size={20} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="custom-card">
          <MapPin size={32} color="var(--primary-500)" style={{ marginBottom: '12px' }} />
          <h3>33 Districts Soil Map</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Explore soil pH, NPK levels, water sources, and APMC markets across Gujarat.</p>
        </div>

        <div className="custom-card">
          <Sparkles size={32} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
          <h3>Smart Krishi Advisory</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Get custom fertilizer and irrigation timing guidance based on your district, crop, and season.</p>
        </div>

        <div className="custom-card">
          <CloudSun size={32} color="var(--accent-blue)" style={{ marginBottom: '12px' }} />
          <h3>Live Weather & Mandi</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Track daily APMC commodity rates and live agricultural weather forecasts.</p>
        </div>
      </div>
    </div>
  );
};
