import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth'; // Your existing auth hook

interface Company { id: string; name: string; domain: string; }
interface CompanyContextType {
  currentCompany: Company | null;
  availableCompanies: Company[];
  setCurrentCompany: (companyId: string) => void;
  hasGlobalAccess: boolean;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [currentCompany, setCurrentCompanyState] = useState<Company | null>(null);
  const [availableCompanies] = useState<Company[]>([
    { id: 'global', name: 'Global Admin', domain: 'mattcoombes247@gmail.com' },
    { id: 'forge-academy', name: 'The Forge Academy', domain: 'forge-academy.com' }
  ]);
  
  const { currentUser } = useAuth();
  const hasGlobalAccess = currentUser?.email === 'mattcoombes247@gmail.com';

  useEffect(() => {
    if (currentUser && availableCompanies.length) {
      const userCompany = availableCompanies.find(c => 
        currentUser.email === c.domain || currentUser.company_id === c.id
      ) || availableCompanies[0];
      setCurrentCompanyState(userCompany);
    }
  }, [currentUser, availableCompanies]);

  const setCurrentCompany = (companyId: string) => {
    const company = availableCompanies.find(c => c.id === companyId);
    if (company && (hasGlobalAccess || currentUser?.company_id === company.id)) {
      setCurrentCompanyState(company);
    }
  };

  return (
    <CompanyContext.Provider value={{ currentCompany, availableCompanies, setCurrentCompany, hasGlobalAccess }}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany must be used within CompanyProvider');
  return context;
};
