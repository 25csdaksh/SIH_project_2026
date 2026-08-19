import React from 'react';
import { Sprout } from 'lucide-react';
import './common.css';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-icon-spin">
        <Sprout size={36} color="var(--primary-500)" />
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};
