import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { CurrentWeather } from '../components/CurrentWeather';
import { WeatherForecast } from '../components/WeatherForecast';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { weatherApi } from '../services/weatherApi';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/weather.css';

export const WeatherPage = () => {
  const { t, language } = useLanguage();
  const [district, setDistrict] = useState('Anand');
  const [searchInput, setSearchInput] = useState('Anand');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async (targetDistrict) => {
    setLoading(true);
    setError(null);
    try {
      const res = await weatherApi.getWeather(targetDistrict);
      setWeatherData(res.data);
    } catch (err) {
      setError('Failed to fetch live weather information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district, language]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setDistrict(searchInput.trim());
    }
  };

  return (
    <div className="weather-page-container">
      <div>
        <h1>{t('weather.title')}</h1>
        <p>Real-time agricultural weather conditions for Gujarat districts.</p>
      </div>

      <form onSubmit={handleSearch} className="weather-search-bar">
        <input
          type="text"
          className="form-select"
          style={{ flex: 1 }}
          placeholder="Enter district name (e.g. Anand, Rajkot, Surat)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit" variant="primary">
          <Search size={18} /> Search
        </Button>
      </form>

      {loading && <Loader message="Fetching live agricultural weather data..." />}
      {error && <ErrorMessage message={error} onRetry={() => fetchWeather(district)} />}
      {!loading && weatherData && (
        <>
          <CurrentWeather weatherData={weatherData} />
          <WeatherForecast forecastSummary={weatherData.forecastSummary} />
        </>
      )}
    </div>
  );
};
