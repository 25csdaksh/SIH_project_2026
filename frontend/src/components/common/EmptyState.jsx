import React from 'react';
import { Inbox } from 'lucide-react';
import './common.css';

export const EmptyState = ({ message = 'No data available', description }) => {
  return (
    <div className="empty-state-container">
      <Inbox size={48} className="empty-icon" />
      <h3>{message}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};
