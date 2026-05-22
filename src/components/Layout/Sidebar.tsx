import React from 'react';

interface SidebarProps {
  user: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, onNavigate, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">eu<span>Cotei</span></div>
      <nav className="sidebar-nav">
        <button className={`sdb-btn ${currentPage === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Orçamentos
        </button>
        <button className={`sdb-btn ${currentPage === 'empresa' ? 'active' : ''}`} onClick={() => onNavigate('empresa')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Minha Empresa
        </button>
      </nav>
      <div className="sidebar-footer">
        <div className="sdb-user">
          <div className="sdb-avatar">{user.substring(0, 2).toUpperCase()}</div>
          <div className="sdb-info">
            <div className="sdb-name">{user}</div>
            <div className="sdb-role">Prestador</div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Sair">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
