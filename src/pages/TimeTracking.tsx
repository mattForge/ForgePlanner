import React, { useState } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useCompany } from '../contexts/CompanyContext';

export function TimeTracking() {
  const { addTimeRecord, users, loading } = useDatabase();
  const { currentCompany } = useCompany();
  const [selectedUser, setSelectedUser] = useState('');
  const [clockIn, setClockIn] = useState('');

  const handleClockIn = () => {
    addTimeRecord({
      user_id: selectedUser,
      clock_in: new Date().toISOString(),
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Time Tracking</h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <div className="space-y-4">
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user[0]} value={user[0]}>
                {user[1]} ({user[2]})
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleClockIn}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700"
          >
            Clock In
          </button>
        </div>
      </div>
    </div>
  );
}
