import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useCompany } from '../contexts/CompanyContext';

export function Timesheets() {
  const { timeRecords, users, loading } = useDatabase();
  const { currentCompany } = useCompany();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">{currentCompany?.name} Timesheets</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Clock In</th>
              <th className="p-4 text-left">Clock Out</th>
              <th className="p-4 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            {timeRecords.map(record => (
              <tr key={record[0]} className="border-t">
                <td className="p-4">{record[1]}</td>
                <td className="p-4">{new Date(record[4]).toLocaleDateString()}</td>
                <td className="p-4">{new Date(record[4]).toLocaleTimeString()}</td>
                <td className="p-4">{record[5] ? new Date(record[5]).toLocaleTimeString() : 'Active'}</td>
                <td className="p-4">{(record[6] / 60).toFixed(1)}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
