import React from 'react';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

export const SeasonSelector = ({ seasons = [], selectedSeason, onChange, disabled }) => {
  const { t } = useLanguage();

  return (
    <div className="selector-group">
      <label className="selector-label">
        <Calendar size={18} color="var(--primary-500)" />
        <span>{t('smartKrishi.step3')}</span>
      </label>
      <select
        className="form-select"
        value={selectedSeason || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || seasons.length === 0}
      >
        <option value="">-- Select Season --</option>
        {seasons.map((s) => (
          <option key={s.seasonCode} value={s.seasonCode}>
            {s.name} ({s.idealMonths})
          </option>
        ))}
      </select>
    </div>
  );
};
