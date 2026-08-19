import React, { useState, useEffect } from 'react';
import { MandiFilters } from '../components/MandiFilters';
import { MandiTable } from '../components/MandiTable';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { mandiApi } from '../services/mandiApi';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/mandi.css';

export const MandiPage = () => {
  const { t, language } = useLanguage();
  const [districtFilter, setDistrictFilter] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('');
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mandiApi.getRates({
        district: districtFilter,
        commodity: commodityFilter
      });
      setRates(res.data || []);
    } catch (err) {
      setError('Failed to fetch APMC mandi rates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRates();
    }, 400);
    return () => clearTimeout(timer);
  }, [districtFilter, commodityFilter, language]);

  return (
    <div className="mandi-page-container">
      <div>
        <h1>{t('mandi.title')}</h1>
        <p>Live daily commodity arrival and price index across Gujarat APMC market yards.</p>
      </div>

      <MandiFilters
        district={districtFilter}
        commodity={commodityFilter}
        onDistrictChange={setDistrictFilter}
        onCommodityChange={setCommodityFilter}
      />

      {loading && <Loader message="Fetching live mandi prices..." />}
      {error && <ErrorMessage message={error} onRetry={fetchRates} />}
      {!loading && <MandiTable rates={rates} />}
    </div>
  );
};
