import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './common.css';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-alert">
      <AlertTriangle size={24} className="error-icon" />
      <div className="error-content">
        <p>{message || 'An unexpected error occurred.'}</p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
