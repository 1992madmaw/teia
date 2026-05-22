import React from 'react';

export const MobileHeader: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <header className="mobile-header">
    <div className="mobile-logo">eu<span>Cotei</span></div>
    <button className="btn btn-ghost" onClick={onLogout} style={{ padding: '6px' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </button>
  </header>
);
