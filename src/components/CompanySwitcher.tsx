import React from 'react';
import { useCompany } from '../contexts/CompanyContext';

export function CompanySwitcher() {
  const { currentCompany, availableCompanies, setCurrentCompany, hasGlobalAccess } = useCompany();
  
  if (!hasGlobalAccess) return null;

  return (
    <div className="mb-6">
      <select
        value={currentCompany?.id || ''}
        onChange={(e) => setCurrentCompany(e.target.value)}
        className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
      >
        {availableCompanies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
}
