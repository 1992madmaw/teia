import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useBudgets } from './hooks/useBudgets';
import { useCompany } from './hooks/useCompany';

import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CompanyPage } from './pages/CompanyPage';
import { Sidebar } from './components/Layout/Sidebar';
import { MobileHeader } from './components/Layout/MobileHeader';
import { BottomNav } from './components/Layout/BottomNav';
import { BudgetModal } from './components/Modals/BudgetModal';

function App() {
  const { user, login, logout } = useAuth();
  const { budgets, addBudget, updateBudget } = useBudgets(user);
  const { company, saveCompany, logoB64, saveLogo } = useCompany(user);

  const [currentPage, setCurrentPage] = useState<'home' | 'empresa'>('home');
  const [toastMsg, setToastMsg] = useState('');
  
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(''), 2500);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  if (!user) {
    return <AuthPage onLogin={login} />;
  }

  const handleOpenNewBudget = () => {
    setEditingBudgetId(null);
    setShowBudgetModal(true);
  };

  const handleOpenEditBudget = (id: string) => {
    setEditingBudgetId(id);
    setShowBudgetModal(true);
  };

  const handleSaveBudget = (data: any) => {
    if (editingBudgetId) {
      updateBudget(editingBudgetId, data);
    } else {
      addBudget(data);
    }
    setShowBudgetModal(false);
  };

  const editingBudget = editingBudgetId ? budgets.find(b => b.id === editingBudgetId) || null : null;

  return (
    <div id="app" style={{ display: 'block' }}>
      <Sidebar user={user} currentPage={currentPage} onNavigate={(p: any) => setCurrentPage(p)} onLogout={logout} />
      <MobileHeader onLogout={logout} />

      <main className="main">
        {currentPage === 'home' && (
          <DashboardPage 
            budgets={budgets} 
            onNewBudget={handleOpenNewBudget} 
            onEditBudget={handleOpenEditBudget} 
          />
        )}
        {currentPage === 'empresa' && (
          <CompanyPage 
            company={company} 
            logoB64={logoB64} 
            onSaveCompany={saveCompany} 
            onSaveLogo={saveLogo} 
            onToast={setToastMsg}
          />
        )}
      </main>

      <BottomNav currentPage={currentPage} onNavigate={(p: any) => setCurrentPage(p)} />

      {showBudgetModal && (
        <BudgetModal
          budget={editingBudget}
          empresa={company}
          logoB64={logoB64}
          onClose={() => setShowBudgetModal(false)}
          onSave={handleSaveBudget}
          onToast={setToastMsg}
        />
      )}

      {toastMsg && (
        <div id="toast" className="show">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

export default App;
