import React from 'react';
import {
  MapPin,
  Sparkles,
  CloudSun,
  TrendingUp,
  Landmark,
  MessageSquareText,
  Bug
} from 'lucide-react';
import { QuickStats } from '../components/dashboard/QuickStats';
import { FeatureCard } from '../components/dashboard/FeatureCard';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import '../components/dashboard/dashboard.css';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      title: t('nav.soilInfo'),
      description: 'Interactive map of all 33 Gujarat districts showing soil pH, NPK profiles, water sources, and APMC market yards.',
      icon: MapPin,
      path: '/soil',
      color: '#2e7d32'
    },
    {
      title: t('nav.smartKrishi'),
      description: '3-step advisory workflow (District → Crop → Season) generating soil, fertilizer, and irrigation timing guidelines.',
      icon: Sparkles,
      path: '/smart-krishi',
      color: '#e65100'
    },
    {
      title: t('nav.weather'),
      description: 'Live agricultural weather forecasts, humidity, temperature, wind speed, and farming advisories.',
      icon: CloudSun,
      path: '/weather',
      color: '#0288d1'
    },
    {
      title: t('nav.mandi'),
      description: 'Live APMC mandi commodity prices filtered by district, market, and commodity.',
      icon: TrendingUp,
      path: '/mandi',
      color: '#f57f17'
    },
    {
      title: t('nav.schemes'),
      description: 'Verified central and Gujarat state agricultural subsidy schemes with official application links.',
      icon: Landmark,
      path: '/government-schemes',
      color: '#00796b'
    },
    {
      title: t('nav.chatbot'),
      description: 'Agriculture-focused Google Gemini AI assistant answering questions in English, Gujarati, and Hindi.',
      icon: MessageSquareText,
      path: '/chatbot',
      color: '#6a1b9a'
    },
    {
      title: t('nav.pestDetection'),
      description: 'AI-assisted crop disease diagnosis and treatment recommendations from leaf images.',
      icon: Bug,
      path: '/pest-detection',
      color: '#d32f2f'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome-banner">
        <h1 className="banner-title">Welcome to KrishiSeva, {user?.name || 'Farmer'}!</h1>
        <p className="banner-subtitle">
          Your unified portal for Gujarat soil intelligence, live APMC mandi rates, AI chatbot & pest diagnostics.
        </p>
      </div>

      <QuickStats />

      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Agricultural Modules</h2>
        <div className="features-grid">
          {features.map((feat) => (
            <FeatureCard key={feat.path} {...feat} />
          ))}
        </div>
      </div>
    </div>
  );
};
