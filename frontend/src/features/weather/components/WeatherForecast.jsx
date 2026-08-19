import React from 'react';
import { Calendar } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { useLanguage } from '../../../hooks/useLanguage';

export const WeatherForecast = ({ forecastSummary }) => {
  const { t } = useLanguage();

  return (
    <Card className="forecast-card">
      <div className="section-card-header">
        <Calendar size={20} color="var(--primary-500)" />
        <h3>{t('weather.forecast')}</h3>
      </div>
      <p className="forecast-text">{forecastSummary || 'Fair weather expected for the next 3 days.'}</p>
    </Card>
  );
};
