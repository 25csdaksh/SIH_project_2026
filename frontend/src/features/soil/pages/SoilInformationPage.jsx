import React, { useState, useEffect } from 'react';
import { GujaratMap } from '../components/GujaratMap';
import { DistrictPanel } from '../components/DistrictPanel';
import { soilApi } from '../services/soilApi';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/soil.css';

export const SoilInformationPage = () => {
  const { t, language } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [districtDetail, setDistrictDetail] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistrictsList = async () => {
      try {
        const res = await soilApi.getDistricts();
        setDistricts(res.data || []);
        if (res.data && res.data.length > 0) {
          // Select Anand or first district default
          const defaultDist = res.data.find((d) => d.districtCode === 'AND') || res.data[0];
          setSelectedDistrictId(defaultDist._id);
        }
      } catch (err) {
        setError('Failed to fetch Gujarat district map data.');
      }
    };
    fetchDistrictsList();
  }, [language]);

  useEffect(() => {
    if (!selectedDistrictId) return;

    const fetchDistrictDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const detailRes = await soilApi.getDistrictById(selectedDistrictId);
        setDistrictDetail(detailRes.data);

        const cropsRes = await soilApi.getDistrictCrops(selectedDistrictId);
        setCrops(cropsRes.data || []);
      } catch (err) {
        setError('Failed to load soil details for selected district.');
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictDetails();
  }, [selectedDistrictId, language]);

  return (
    <div className="soil-page-container">
      <div className="soil-header">
        <h1>{t('soil.title')}</h1>
        <p>{t('soil.subtitle')}</p>
      </div>

      <div className="soil-content-layout">
        <GujaratMap
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={(id) => setSelectedDistrictId(id)}
        />
        <DistrictPanel
          districtDetail={districtDetail}
          crops={crops}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};
