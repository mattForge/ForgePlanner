import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useCompany } from '../contexts/CompanyContext';

export function Dashboard() {
  const { timeRecords, users, teams, loading } = useDatabase();
  const { currentCompany, hasGlobalAccess } = useCompany();

  if (loading) return <div>Loading...</div>;

  const totalHours = timeRecords.reduce((sum, record) => sum + (record[6] || 0), 0) / 60;
  const activeUsers = users.length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">{currentCompany?.name} Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}h</h2>
          <p>Total Hours</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-green-600">{activeUsers}</h2>
          <p>Active Users</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-purple-600">{teams.length}</h2>
          <p>Teams</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {timeRecords.slice(0, 5).map(record => (
            <div key={record[0]} className="flex justify-between text-sm">
              <span>{record[1]}</span>
              <span>{new Date(record[4]).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
