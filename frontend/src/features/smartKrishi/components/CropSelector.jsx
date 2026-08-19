import React from 'react';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

export const CropSelector = ({ crops = [], selectedCropId, onChange, disabled }) => {
  const { t } = useLanguage();

  return (
    <div className="selector-group">
      <label className="selector-label">
        <Sprout size={18} color="var(--primary-500)" />
        <span>{t('smartKrishi.step2')}</span>
      </label>
      <select
        className="form-select"
        value={selectedCropId || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || crops.length === 0}
      >
        <option value="">-- Select Crop --</option>
        {crops.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};
