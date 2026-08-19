import React, { useState, useEffect } from 'react';
import { SchemeCard } from '../components/SchemeCard';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { schemesApi } from '../services/schemesApi';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/schemes.css';

export const GovernmentSchemesPage = () => {
  const { t, language } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await schemesApi.getSchemes();
      setSchemes(res.data || []);
    } catch (err) {
      setError('Failed to fetch government schemes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [language]);

  return (
    <div className="schemes-page-container">
      <div>
        <h1>{t('schemes.title')}</h1>
        <p>{t('schemes.subtitle')}</p>
      </div>

      {loading && <Loader message="Fetching verified government agricultural schemes..." />}
      {error && <ErrorMessage message={error} onRetry={fetchSchemes} />}
      {!loading && (
        <div className="schemes-grid">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme._id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};
