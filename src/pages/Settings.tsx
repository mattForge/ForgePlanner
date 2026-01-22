import React from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { CompanySwitcher } from '../components/CompanySwitcher';

export function Settings() {
  const { currentCompany, hasGlobalAccess } = useCompany();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        {hasGlobalAccess && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Active Company</h3>
            <CompanySwitcher />
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Current Company</h3>
          <p className="text-gray-600">{currentCompany?.name}</p>
          <p className="text-sm text-gray-500">{currentCompany?.domain}</p>
        </div>
      </div>
    </div>
  );
}
