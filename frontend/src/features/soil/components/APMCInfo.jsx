import React from 'react';
import { Store } from 'lucide-react';
import { Card } from '../../../components/common/Card';

export const APMCInfo = ({ apmcs = [] }) => {
  return (
    <Card className="apmc-section-card">
      <div className="section-card-header">
        <Store size={20} color="var(--accent-gold)" />
        <h3>Nearby APMC Market Yards</h3>
      </div>
      <ul className="apmc-list">
        {apmcs.map((apmc, index) => (
          <li key={index} className="apmc-item">
            <Store size={16} /> {apmc}
          </li>
        ))}
      </ul>
    </Card>
  );
};
