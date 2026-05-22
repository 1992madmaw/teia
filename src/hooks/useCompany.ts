import { useState, useEffect } from 'react';
import type { Empresa } from '../services/storage';
import { StorageService } from '../services/storage';

export const useCompany = (user: string | null) => {
  const [company, setCompany] = useState<Empresa>({});
  const [logoB64, setLogoB64] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setCompany(StorageService.getEmpresa(user));
      setLogoB64(StorageService.getLogo(user));
    } else {
      setCompany({});
      setLogoB64(null);
    }
  }, [user]);

  const saveCompany = (emp: Empresa) => {
    if (!user) return;
    StorageService.saveEmpresa(user, emp);
    setCompany(emp);
  };

  const saveLogo = (logo: string) => {
    if (!user) return;
    StorageService.saveLogo(user, logo);
    setLogoB64(logo);
  };

  return { company, saveCompany, logoB64, saveLogo };
};
