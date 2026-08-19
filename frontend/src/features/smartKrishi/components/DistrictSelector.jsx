import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

export const DistrictSelector = ({ districts = [], selectedDistrictId, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className="selector-group">
      <label className="selector-label">
        <MapPin size={18} color="var(--primary-500)" />
        <span>{t('smartKrishi.step1')}</span>
      </label>
      <select
        className="form-select"
        value={selectedDistrictId || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select District --</option>
        {districts.map((d) => (
          <option key={d._id} value={d._id}>
            {d.districtName} ({d.districtCode})
          </option>
        ))}
      </select>
    </div>
  );
};
