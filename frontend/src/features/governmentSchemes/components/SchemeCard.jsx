import React from 'react';
import { ExternalLink, Landmark, CheckCircle, Gift } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { useLanguage } from '../../../hooks/useLanguage';

export const SchemeCard = ({ scheme }) => {
  const { t } = useLanguage();
  const { title, description, eligibility, benefits, department, officialWebsite, applicationLink } = scheme;

  return (
    <Card className="scheme-card">
      <div className="scheme-header-row">
        <div className="scheme-title-wrap">
          <Landmark size={24} color="var(--primary-500)" />
          <h3>{title}</h3>
        </div>
        <span className="badge badge-success">Official Scheme</span>
      </div>

      <p className="scheme-description">{description}</p>

      <div className="scheme-details-grid">
        <div className="scheme-detail-block">
          <div className="block-label">
            <CheckCircle size={16} color="var(--accent-teal)" />
            <strong>{t('schemes.eligibility')}</strong>
          </div>
          <p>{eligibility}</p>
        </div>

        <div className="scheme-detail-block">
          <div className="block-label">
            <Gift size={16} color="var(--accent-gold)" />
            <strong>{t('schemes.benefits')}</strong>
          </div>
          <p>{benefits}</p>
        </div>
      </div>

      <div className="scheme-footer-row flex-between">
        <span className="department-tag">{department}</span>
        <a
          href={applicationLink || officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-medium"
        >
          {t('schemes.applyBtn')} <ExternalLink size={16} />
        </a>
      </div>
    </Card>
  );
};
