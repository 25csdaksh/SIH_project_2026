import React from 'react';
import { CloudSun, Thermometer, Wind, Droplets } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { useLanguage } from '../../../hooks/useLanguage';

export const CurrentWeather = ({ weatherData }) => {
  const { t } = useLanguage();
  if (!weatherData) return null;

  const { district, temperature, feelsLike, humidity, rainfall, windSpeed, condition } = weatherData;

  return (
    <Card className="current-weather-card">
      <div className="weather-header-row">
        <div>
          <span className="badge badge-success">{district} District</span>
          <h2 className="weather-temp-main">{temperature}</h2>
          <p className="weather-cond-str">{condition}</p>
        </div>
        <CloudSun size={64} className="weather-main-icon" />
      </div>

      <div className="weather-stats-row">
        <div className="stat-item">
          <Thermometer size={20} color="var(--accent-gold)" />
          <div>
            <span className="stat-label">Feels Like</span>
            <strong className="stat-val">{feelsLike}</strong>
          </div>
        </div>

        <div className="stat-item">
          <Droplets size={20} color="var(--accent-blue)" />
          <div>
            <span className="stat-label">{t('weather.humidity')}</span>
            <strong className="stat-val">{humidity}</strong>
          </div>
        </div>

        <div className="stat-item">
          <Wind size={20} color="var(--primary-500)" />
          <div>
            <span className="stat-label">{t('weather.wind')}</span>
            <strong className="stat-val">{windSpeed}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
};
