import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

export function TeamManagement() {
  const { teams, loading } = useDatabase();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left">Team Name</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team[0]} className="border-t">
                <td className="p-4 font-semibold">{team[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
