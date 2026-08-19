import React from 'react';
import { Sprout } from 'lucide-react';
import { Card } from '../../../components/common/Card';

export const CropList = ({ crops = [] }) => {
  return (
    <Card className="crops-section-card">
      <div className="section-card-header">
        <Sprout size={20} color="var(--primary-500)" />
        <h3>Suitable Crops for Selected District</h3>
      </div>
      <div className="crops-grid">
        {crops.map((crop) => (
          <div key={crop._id} className="crop-badge-item">
            <span className="crop-name">{crop.name}</span>
            <div className="crop-seasons-tags">
              {crop.availableSeasons.map((s) => (
                <span key={s.seasonCode} className="season-tag">
                  {s.name} ({s.idealMonths})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
