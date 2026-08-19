import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import './dashboard.css';

export const FeatureCard = ({ title, description, icon: Icon, path, color }) => {
  return (
    <Card className="feature-nav-card">
      <div className="feature-card-header">
        <div className="feature-icon-badge" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={26} />
        </div>
        <ArrowRight size={20} className="feature-arrow" />
      </div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-desc">{description}</p>
      <Link to={path} className="feature-card-link-overlay"></Link>
    </Card>
  );
};
