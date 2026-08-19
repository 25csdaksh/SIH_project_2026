import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { EmptyState } from '../../../components/common/EmptyState';

export const MandiTable = ({ rates = [] }) => {
  const { t } = useLanguage();

  if (rates.length === 0) {
    return <EmptyState message="No Mandi commodity prices match your filters." />;
  }

  return (
    <div className="table-responsive">
      <table className="mandi-table">
        <thead>
          <tr>
            <th>{t('mandi.market')}</th>
            <th>District</th>
            <th>{t('mandi.commodity')}</th>
            <th>Variety</th>
            <th>{t('mandi.minPrice')}</th>
            <th>{t('mandi.maxPrice')}</th>
            <th>{t('mandi.modalPrice')}</th>
            <th>{t('mandi.arrivalDate')}</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((row, index) => (
            <tr key={index}>
              <td className="fw-600">{row.market}</td>
              <td>{row.district}</td>
              <td className="fw-600 color-primary">{row.commodity}</td>
              <td>{row.variety}</td>
              <td>₹ {row.minimumPrice}</td>
              <td>₹ {row.maximumPrice}</td>
              <td className="fw-700 color-gold">₹ {row.modalPrice}</td>
              <td>{row.arrivalDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
