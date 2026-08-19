import React from 'react';
import './common.css';

export const Card = ({ children, className = '', onClick }) => {
  return (
    <div className={`custom-card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
