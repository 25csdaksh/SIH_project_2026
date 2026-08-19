import React from 'react';
import { MapPin, Sprout, Landmark, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import './dashboard.css';

export const QuickStats = () => {
  const stats = [
    { label: 'Gujarat Districts Covered', val: '33 Districts', icon: MapPin, color: 'var(--primary-500)' },
    { label: 'Supported Crops', val: '12 Major Crops', icon: Sprout, color: 'var(--accent-teal)' },
    { label: 'Live Mandi Prices', val: 'APMC Markets', icon: TrendingUp, color: 'var(--accent-gold)' },
    { label: 'Official Subsidy Schemes', val: '4 Schemes', icon: Landmark, color: 'var(--accent-blue)' }
  ];

  return (
    <div className="quick-stats-grid">
      {stats.map((s, index) => {
        const Icon = s.icon;
        return (
          <Card key={index} className="quick-stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
              <Icon size={24} />
            </div>
            <div>
              <span className="stat-card-label">{s.label}</span>
              <h3 className="stat-card-val">{s.val}</h3>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
