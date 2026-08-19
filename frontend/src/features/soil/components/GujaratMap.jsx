import React from 'react';
import { MapPin } from 'lucide-react';
import '../styles/soil.css';

export const GujaratMap = ({ districts = [], selectedDistrictId, onSelectDistrict }) => {
  // Map of 33 Gujarat Districts with coordinates/region layouts
  const districtGrid = [
    { code: 'BAN', name: 'Banaskantha', region: 'North' },
    { code: 'PAT', name: 'Patan', region: 'North' },
    { code: 'MEH', name: 'Mehsana', region: 'North' },
    { code: 'SAB', name: 'Sabarkantha', region: 'North' },
    { code: 'ARV', name: 'Aravalli', region: 'North' },
    { code: 'KUT', name: 'Kutch', region: 'Kutch' },
    { code: 'SUD', name: 'Surendranagar', region: 'Saurashtra' },
    { code: 'AMD', name: 'Ahmedabad', region: 'Central' },
    { code: 'GND', name: 'Gandhinagar', region: 'Central' },
    { code: 'KHE', name: 'Kheda', region: 'Central' },
    { code: 'AND', name: 'Anand', region: 'Central' },
    { code: 'PAN', name: 'Panchmahal', region: 'Central' },
    { code: 'MAH', name: 'Mahisagar', region: 'Central' },
    { code: 'DAH', name: 'Dahod', region: 'Central' },
    { code: 'CHU', name: 'Chhota Udaipur', region: 'Central' },
    { code: 'VAD', name: 'Vadodara', region: 'Central' },
    { code: 'MOR', name: 'Morbi', region: 'Saurashtra' },
    { code: 'JAM', name: 'Jamnagar', region: 'Saurashtra' },
    { code: 'DEV', name: 'Devbhumi Dwarka', region: 'Saurashtra' },
    { code: 'RAJ', name: 'Rajkot', region: 'Saurashtra' },
    { code: 'POR', name: 'Porbandar', region: 'Saurashtra' },
    { code: 'JUN', name: 'Junagadh', region: 'Saurashtra' },
    { code: 'GIR', name: 'Gir Somnath', region: 'Saurashtra' },
    { code: 'AMR', name: 'Amreli', region: 'Saurashtra' },
    { code: 'BHV', name: 'Bhavnagar', region: 'Saurashtra' },
    { code: 'BOT', name: 'Botad', region: 'Saurashtra' },
    { code: 'BHR', name: 'Bharuch', region: 'South' },
    { code: 'NAR', name: 'Narmada', region: 'South' },
    { code: 'SUR', name: 'Surat', region: 'South' },
    { code: 'TAP', name: 'Tapi', region: 'South' },
    { code: 'NAV', name: 'Navsari', region: 'South' },
    { code: 'DNG', name: 'Dang', region: 'South' },
    { code: 'VAL', name: 'Valsad', region: 'South' }
  ];

  return (
    <div className="gujarat-map-card">
      <div className="map-header">
        <MapPin size={22} className="map-header-icon" />
        <h3>Interactive 33 Districts Map of Gujarat</h3>
      </div>
      <p className="map-instruction">
        Click any district pin below to inspect soil pH, NPK, APMC markets & suitable crops:
      </p>
      
      <div className="districts-interactive-grid">
        {districtGrid.map((item) => {
          // Find matching district object from API
          const matched = districts.find(
            (d) => d.districtCode === item.code || d.districtName === item.name || d._id === selectedDistrictId
          );
          const districtIdToPass = matched ? matched._id : item.code;
          const isSelected = selectedDistrictId === districtIdToPass || (matched && selectedDistrictId === matched._id);

          return (
            <button
              key={item.code}
              type="button"
              className={`district-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDistrict(districtIdToPass)}
            >
              <span className="district-chip-code">{item.code}</span>
              <span className="district-chip-name">{matched ? matched.districtName : item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
