import React, { useState } from 'react';
import { StorageService } from '../services/storage';

interface AuthPageProps {
  onLogin: (user: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'login' | 'cadastro'>('login');
  const [error, setError] = useState('');

  const [logUser, setLogUser] = useState('');
  const [logPass, setLogPass] = useState('');

  const [cadUser, setCadUser] = useState('');
  const [cadEmp, setCadEmp] = useState('');
  const [cadPass, setCadPass] = useState('');
  const [cadPass2, setCadPass2] = useState('');

  const handleLogin = () => {
    if (!logUser || !logPass) return setError('Preencha usuário e senha.');
    const acc = StorageService.getAccounts();
    if (!acc[logUser] || acc[logUser].p !== btoa(logPass)) return setError('Usuário ou senha incorretos.');
    onLogin(logUser);
  };

  const handleCadastro = () => {
    if (!cadUser || !cadEmp || !cadPass) return setError('Preencha todos os campos.');
    if (cadPass.length < 6) return setError('Senha deve ter ao menos 6 caracteres.');
    if (cadPass !== cadPass2) return setError('As senhas não coincidem.');
    const acc = StorageService.getAccounts();
    if (acc[cadUser]) return setError('Usuário já existe.');
    
    acc[cadUser] = { p: btoa(cadPass), emp: cadEmp };
    StorageService.saveAccounts(acc);
    StorageService.saveEmpresa(cadUser, { nome: cadEmp });
    onLogin(cadUser);
  };

  return (
    <div id="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">eu<span>Cotei</span></div>
        <p className="auth-tagline">Orçamentos profissionais para prestadores de serviço</p>

        {error && <div className="auth-error" style={{ display: 'block' }}>{error}</div>}

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Entrar</button>
          <button className={`auth-tab ${tab === 'cadastro' ? 'active' : ''}`} onClick={() => setTab('cadastro')}>Criar conta</button>
        </div>

        {tab === 'login' && (
          <div className="auth-form" onKeyDown={e => e.key === 'Enter' && handleLogin()}>
            <input type="text" placeholder="Usuário" value={logUser} onChange={e => setLogUser(e.target.value)} />
            <input type="password" placeholder="Senha" value={logPass} onChange={e => setLogPass(e.target.value)} />
            <button className="auth-btn" onClick={handleLogin}>Entrar</button>
          </div>
        )}

        {tab === 'cadastro' && (
          <div className="auth-form" onKeyDown={e => e.key === 'Enter' && handleCadastro()}>
            <input type="text" placeholder="Nome de usuário" value={cadUser} onChange={e => setCadUser(e.target.value)} />
            <input type="text" placeholder="Nome da empresa" value={cadEmp} onChange={e => setCadEmp(e.target.value)} />
            <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={cadPass} onChange={e => setCadPass(e.target.value)} />
            <input type="password" placeholder="Confirmar senha" value={cadPass2} onChange={e => setCadPass2(e.target.value)} />
            <button className="auth-btn" onClick={handleCadastro}>Criar conta</button>
          </div>
        )}

        <p className="auth-note">⚠️ Versão de testes — dados salvos no navegador.<br/>Não limpe o cache para preservar suas informações.</p>
      </div>
    </div>
  );
};
