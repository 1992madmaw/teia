import { useState, useEffect } from 'react';
import type { Budget } from '../services/storage';
import { StorageService } from '../services/storage';

export const useBudgets = (user: string | null) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    if (user) {
      setBudgets(StorageService.getBudgets(user));
    } else {
      setBudgets([]);
    }
  }, [user]);

  const saveBudgets = (newBudgets: Budget[]) => {
    if (!user) return;
    StorageService.saveBudgets(user, newBudgets);
    setBudgets(newBudgets);
  };

  const addBudget = (budgetData: Omit<Budget, 'id' | 'numero' | 'status'>) => {
    if (!user) return;
    const cnt = StorageService.incrementCounter(user);
    const numero = String(cnt).padStart(3, '0');
    const id = Date.now().toString();
    const newBudget: Budget = {
      id,
      numero,
      status: 'Pendente',
      ...budgetData
    };
    const newBudgets = [...budgets, newBudget];
    saveBudgets(newBudgets);
    return id;
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    const newBudgets = budgets.map(b => b.id === id ? { ...b, ...updates } : b);
    saveBudgets(newBudgets);
  };

  const removeBudget = (id: string) => {
    const newBudgets = budgets.filter(b => b.id !== id);
    saveBudgets(newBudgets);
  };

  return { budgets, addBudget, updateBudget, removeBudget };
};
