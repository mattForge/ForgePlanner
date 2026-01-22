import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

export function UserManagement() {
  const { users, loading } = useDatabase();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user[0]} className="border-t">
                <td className="p-4">{user[1]}</td>
                <td className="p-4">{user[2]}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user[3] === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                    user[3] === 'admin' ? 'bg-blue-100 text-blue-800' :
                    user[3] === 'hr' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user[3]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
