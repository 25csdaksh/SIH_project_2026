import React from 'react';
import { Layers, Droplets, Activity } from 'lucide-react';
import { Card } from '../../../components/common/Card';

export const SoilDetails = ({ soilInfo }) => {
  const { soilType, averagePH, npkInfo, waterSources } = soilInfo;

  return (
    <div className="soil-metrics-grid">
      <Card className="metric-card">
        <div className="metric-icon-wrap">
          <Layers size={24} color="var(--primary-500)" />
        </div>
        <div className="metric-info">
          <span className="metric-label">Soil Classification</span>
          <h4 className="metric-val">{soilType}</h4>
        </div>
      </Card>

      <Card className="metric-card">
        <div className="metric-icon-wrap">
          <Activity size={24} color="var(--accent-gold)" />
        </div>
        <div className="metric-info">
          <span className="metric-label">Average pH Balance</span>
          <h4 className="metric-val">{averagePH} pH</h4>
        </div>
      </Card>

      <Card className="metric-card">
        <div className="metric-icon-wrap">
          <Droplets size={24} color="var(--accent-blue)" />
        </div>
        <div className="metric-info">
          <span className="metric-label">Water & Irrigation Sources</span>
          <ul className="pill-list">
            {(waterSources || []).map((w, index) => (
              <li key={index} className="source-pill">
                {w}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};
