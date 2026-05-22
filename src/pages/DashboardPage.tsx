import React from 'react';
import type { Budget } from '../services/storage';
import { Button } from '../components/UI/Button';

interface DashboardPageProps {
  budgets: Budget[];
  onNewBudget: () => void;
  onEditBudget: (id: string) => void;
}

const fm = (n: number) => 'R$ ' + (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const DashboardPage: React.FC<DashboardPageProps> = ({ budgets, onNewBudget, onEditBudget }) => {
  const total = budgets.reduce((s, o) => s + (o.total || 0), 0);
  const pend = budgets.filter(o => o.status === 'Pendente').length;

  return (
    <div className="page active" id="page-home">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orçamentos</h1>
          <p className="page-sub">
            {budgets.length ? `${budgets.length} orçamento${budgets.length > 1 ? 's' : ''}` : 'Nenhum orçamento ainda'}
          </p>
        </div>
        <Button size="lg" onClick={onNewBudget} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
          Novo Orçamento
        </Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{budgets.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pendentes</div>
          <div className="stat-value">{pend}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valor total</div>
          <div className="stat-value accent">{fm(total)}</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {budgets.length > 0 ? (
            <table id="orca-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {budgets.slice().reverse().map(o => (
                  <tr key={o.id} onClick={() => onEditBudget(o.id)}>
                    <td><span className="num-tag">#{o.numero}</span></td>
                    <td className="fw-600">{o.cliente}</td>
                    <td className="muted">{o.data}</td>
                    <td><span className="badge badge-pending">{o.status || 'Pendente'}</span></td>
                    <td className="text-right fw-600">{fm(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div id="empty-state">
              <div className="empty">
                <div className="empty-icon">📄</div>
                <h3>Nenhum orçamento ainda</h3>
                <p>Crie seu primeiro orçamento agora mesmo.</p>
                <Button onClick={onNewBudget} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
                  Criar orçamento
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
