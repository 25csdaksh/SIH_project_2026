import React from 'react';
import {
  Layers,
  Activity,
  Zap,
  CloudSun,
  FlaskConical,
  Droplets,
  Bug,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { useLanguage } from '../../../hooks/useLanguage';

export const AdvisoryResult = ({ advisory }) => {
  const { t } = useLanguage();
  if (!advisory) return null;

  const {
    district,
    crop,
    season,
    soilInformation,
    phLevel,
    npkLevel,
    weatherInformation,
    fertilizerSuggestion,
    waterTiming,
    possibleDiseases = [],
    precautions = []
  } = advisory;

  return (
    <div className="advisory-results-wrapper">
      <div className="advisory-header-card">
        <h2 className="advisory-title">
          {crop} Advisory for {district} ({season})
        </h2>
      </div>

      <div className="advisory-grid">
        {/* 1. Soil Information */}
        <Card className="advisory-card">
          <div className="card-icon-title">
            <Layers size={22} color="var(--primary-500)" />
            <h4>{t('smartKrishi.soilInfoCard')}</h4>
          </div>
          <p className="card-text">{soilInformation}</p>
        </Card>

        {/* 2. pH Level */}
        <Card className="advisory-card">
          <div className="card-icon-title">
            <Activity size={22} color="var(--accent-gold)" />
            <h4>{t('smartKrishi.phCard')}</h4>
          </div>
          <p className="card-text bold-text">{phLevel} pH</p>
        </Card>

        {/* 3. NPK Level */}
        <Card className="advisory-card">
          <div className="card-icon-title">
            <Zap size={22} color="var(--accent-yellow)" />
            <h4>{t('smartKrishi.npkCard')}</h4>
          </div>
          <div className="npk-tags">
            <span className="npk-pill">N: {npkLevel?.nitrogen || 'Medium'}</span>
            <span className="npk-pill">P: {npkLevel?.phosphorus || 'Medium'}</span>
            <span className="npk-pill">K: {npkLevel?.potassium || 'High'}</span>
          </div>
        </Card>

        {/* 4. Weather Information */}
        <Card className="advisory-card">
          <div className="card-icon-title">
            <CloudSun size={22} color="var(--accent-blue)" />
            <h4>{t('smartKrishi.weatherCard')}</h4>
          </div>
          <p className="card-text">{weatherInformation}</p>
        </Card>

        {/* 5. Fertilizer Suggestion */}
        <Card className="advisory-card full-width">
          <div className="card-icon-title">
            <FlaskConical size={22} color="var(--primary-500)" />
            <h4>{t('smartKrishi.fertilizerCard')}</h4>
          </div>
          <p className="card-text">{fertilizerSuggestion}</p>
        </Card>

        {/* 6. Water Timing */}
        <Card className="advisory-card full-width">
          <div className="card-icon-title">
            <Droplets size={22} color="var(--accent-blue)" />
            <h4>{t('smartKrishi.waterCard')}</h4>
          </div>
          <p className="card-text">{waterTiming}</p>
        </Card>

        {/* 7. Possible Diseases */}
        <Card className="advisory-card full-width">
          <div className="card-icon-title">
            <Bug size={22} color="#e53935" />
            <h4>{t('smartKrishi.diseasesCard')}</h4>
          </div>
          <ul className="advisory-list">
            {possibleDiseases.map((d, index) => (
              <li key={index}>{d}</li>
            ))}
          </ul>
        </Card>

        {/* 8. Precautions */}
        <Card className="advisory-card full-width">
          <div className="card-icon-title">
            <ShieldAlert size={22} color="var(--accent-gold)" />
            <h4>{t('smartKrishi.precautionsCard')}</h4>
          </div>
          <ul className="advisory-list">
            {precautions.map((p, index) => (
              <li key={index}>{p}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
