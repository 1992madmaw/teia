import React from 'react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => (
  <nav className="bottom-nav">
    <div className="bottom-nav-inner">
      <button className={`bnav-btn ${currentPage === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Orçamentos
      </button>
      <button className={`bnav-btn ${currentPage === 'empresa' ? 'active' : ''}`} onClick={() => onNavigate('empresa')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Empresa
      </button>
    </div>
  </nav>
);
