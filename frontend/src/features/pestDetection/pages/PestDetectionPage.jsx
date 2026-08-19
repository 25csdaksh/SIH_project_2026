import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { DetectionResult } from '../components/DetectionResult';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/common/ErrorMessage';
import { pestDetectionApi } from '../services/pestDetectionApi';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/pestDetection.css';

export const PestDetectionPage = () => {
  const { t, language } = useLanguage();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (formData) => {
    formData.append('language', language);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await pestDetectionApi.analyzeImage(formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze crop image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pest-page-container">
      <div>
        <h1>{t('pest.title')}</h1>
        <p>Upload a clear photo of your affected crop leaf or stem for instant diagnostic and organic treatment recommendations.</p>
      </div>

      <ImageUploader onAnalyze={handleAnalyze} loading={loading} />

      {loading && <Loader message="Analyzing crop image health using diagnostics model..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && result && <DetectionResult result={result} />}
    </div>
  );
};
