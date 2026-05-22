export interface Empresa {
  nome?: string;
  doc?: string;
  tel?: string;
  email?: string;
  site?: string;
  end?: string;
  validade?: string;
  pagamento?: string;
  obs?: string;
}

export interface BudgetItem {
  desc: string;
  qtd: number;
  valor: number;
}

export interface Budget {
  id: string;
  numero: string;
  status: string;
  cliente: string;
  telCliente?: string;
  local?: string;
  pagamento?: string;
  prazo?: string;
  obs?: string;
  total: number;
  data: string;
  items: BudgetItem[];
}

export const StorageService = {
  getSession: () => localStorage.getItem('ec_sess'),
  setSession: (user: string) => localStorage.setItem('ec_sess', user),
  clearSession: () => localStorage.removeItem('ec_sess'),

  getAccounts: () => JSON.parse(localStorage.getItem('ec_acc') || '{}'),
  saveAccounts: (acc: Record<string, any>) => localStorage.setItem('ec_acc', JSON.stringify(acc)),

  getEmpresa: (user: string): Empresa => JSON.parse(localStorage.getItem(`ec_emp_${user}`) || '{}'),
  saveEmpresa: (user: string, emp: Empresa) => localStorage.setItem(`ec_emp_${user}`, JSON.stringify(emp)),
  
  getLogo: (user: string) => localStorage.getItem(`ec_logo_${user}`),
  saveLogo: (user: string, logo: string) => localStorage.setItem(`ec_logo_${user}`, logo),

  getBudgets: (user: string): Budget[] => JSON.parse(localStorage.getItem(`ec_orc_${user}`) || '[]'),
  saveBudgets: (user: string, budgets: Budget[]) => localStorage.setItem(`ec_orc_${user}`, JSON.stringify(budgets)),
  
  getCounter: (user: string): number => parseInt(localStorage.getItem(`ec_cnt_${user}`) || '0'),
  incrementCounter: (user: string): number => {
    const cnt = StorageService.getCounter(user) + 1;
    localStorage.setItem(`ec_cnt_${user}`, String(cnt));
    return cnt;
  }
};
