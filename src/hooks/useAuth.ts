import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const session = StorageService.getSession();
    if (session) setUser(session);
  }, []);

  const login = (username: string) => {
    StorageService.setSession(username);
    setUser(username);
  };

  const logout = () => {
    StorageService.clearSession();
    setUser(null);
  };

  return { user, login, logout };
};
