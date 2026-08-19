import React, { useState, useEffect } from 'react';
import { DistrictSelector } from '../components/DistrictSelector';
import { CropSelector } from '../components/CropSelector';
import { SeasonSelector } from '../components/SeasonSelector';
import { AdvisoryResult } from '../components/AdvisoryResult';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { soilApi } from '../../soil/services/soilApi';
import { smartKrishiApi } from '../services/smartKrishiApi';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/smartKrishi.css';

export const SmartKrishiPage = () => {
  const { t, language } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [crops, setCrops] = useState([]);
  const [seasons, setSeasons] = useState([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedCropId, setSelectedCropId] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');

  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch All Districts on Mount / Language change
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await soilApi.getDistricts();
        setDistricts(res.data || []);
      } catch (err) {
        setError('Failed to fetch districts list.');
      }
    };
    fetchDistricts();
  }, [language]);

  // 2. Step 1: District Change -> Fetch District Crops
  const handleDistrictChange = async (districtId) => {
    setSelectedDistrictId(districtId);
    setSelectedCropId('');
    setSelectedSeason('');
    setCrops([]);
    setSeasons([]);
    setAdvisory(null);

    if (!districtId) return;

    try {
      const res = await soilApi.getDistrictCrops(districtId);
      setCrops(res.data || []);
    } catch (err) {
      setError('Failed to fetch crops for selected district.');
    }
  };

  // 3. Step 2: Crop Change -> Fetch Crop Seasons
  const handleCropChange = async (cropId) => {
    setSelectedCropId(cropId);
    setSelectedSeason('');
    setSeasons([]);
    setAdvisory(null);

    if (!cropId) return;

    try {
      const res = await smartKrishiApi.getCropSeasons(cropId);
      setSeasons(res.data || []);
    } catch (err) {
      setError('Failed to fetch seasons for selected crop.');
    }
  };

  // 4. Step 3 & 4: Generate Advisory
  const handleGenerateAdvisory = async () => {
    if (!selectedDistrictId || !selectedCropId || !selectedSeason) {
      setError('Please select district, crop, and season.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await smartKrishiApi.getAdvisory({
        districtId: selectedDistrictId,
        cropId: selectedCropId,
        season: selectedSeason,
        language
      });
      setAdvisory(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate advisory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-krishi-container">
      <div className="smart-krishi-header">
        <h1>{t('smartKrishi.title')}</h1>
        <p>Follow the 3-step dropdown workflow to generate precision crop, soil & irrigation advisory.</p>
      </div>

      <div className="form-card">
        <div className="selectors-row">
          <DistrictSelector
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            onChange={handleDistrictChange}
          />
          <CropSelector
            crops={crops}
            selectedCropId={selectedCropId}
            onChange={handleCropChange}
            disabled={!selectedDistrictId}
          />
          <SeasonSelector
            seasons={seasons}
            selectedSeason={selectedSeason}
            onChange={setSelectedSeason}
            disabled={!selectedCropId}
          />
        </div>

        <Button
          variant="primary"
          size="medium"
          disabled={!selectedDistrictId || !selectedCropId || !selectedSeason}
          loading={loading}
          onClick={handleGenerateAdvisory}
        >
          {t('smartKrishi.generateBtn')}
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && <Loader message="Generating Smart Krishi Advisory insights..." />}
      {advisory && !loading && <AdvisoryResult advisory={advisory} />}
    </div>
  );
};
