import React from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export function CompanySwitcher() {
  const { currentCompany, availableCompanies, setCurrentCompany, hasGlobalAccess } = useCompany();
  
  if (!hasGlobalAccess) return null;

  return (
    <div className="relative">
      <select
        value={currentCompany?.id || ''}
        onChange={(e) => setCurrentCompany(e.target.value)}
        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 appearance-none"
      >
        {availableCompanies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  );
}
