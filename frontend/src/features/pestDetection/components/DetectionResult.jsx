import React from 'react';
import { AlertCircle, CheckSquare, ShieldCheck } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/pestDetection.css';

export const DetectionResult = ({ result }) => {
  const { t } = useLanguage();
  if (!result) return null;

  const { diseaseName, confidence, description, recommendedAction, prevention } = result;

  return (
    <Card className="detection-result-card">
      <div className="result-header">
        <AlertCircle size={28} color="#e53935" />
        <div>
          <span className="badge badge-warning">{t('pest.diagnosisTitle')}</span>
          <h2 className="disease-name-title">{diseaseName}</h2>
          <span className="confidence-tag">Diagnostic Accuracy: {confidence}</span>
        </div>
      </div>

      <p className="disease-desc">{description}</p>

      <div className="treatment-grid">
        <div className="treatment-block">
          <div className="treatment-title">
            <CheckSquare size={18} color="var(--primary-500)" />
            <strong>{t('pest.recommendedAction')}</strong>
          </div>
          <p>{recommendedAction}</p>
        </div>

        <div className="treatment-block">
          <div className="treatment-title">
            <ShieldCheck size={18} color="var(--accent-teal)" />
            <strong>{t('pest.prevention')}</strong>
          </div>
          <p>{prevention}</p>
        </div>
      </div>
    </Card>
  );
};
