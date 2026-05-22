import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="card">
    {title && (
      <div className="card-header">
        <span className="card-title">{title}</span>
      </div>
    )}
    <div className="card-body">{children}</div>
  </div>
);
