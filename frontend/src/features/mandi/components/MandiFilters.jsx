import React from 'react';
import { Filter } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';

export const MandiFilters = ({ district, commodity, onDistrictChange, onCommodityChange }) => {
  const { t } = useLanguage();

  return (
    <div className="mandi-filters-card">
      <div className="filter-header">
        <Filter size={18} color="var(--primary-500)" />
        <span>Filter Mandi Prices</span>
      </div>
      <div className="filters-grid">
        <input
          type="text"
          className="form-select"
          placeholder="Filter by District (e.g. Anand, Rajkot)"
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
        />
        <input
          type="text"
          className="form-select"
          placeholder="Filter by Commodity (e.g. Cotton, Groundnut)"
          value={commodity}
          onChange={(e) => onCommodityChange(e.target.value)}
        />
      </div>
    </div>
  );
};
