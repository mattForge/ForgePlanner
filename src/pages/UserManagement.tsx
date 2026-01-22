import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { UserTable } from '../components/admin/UserTable';
import { CreateUserModal } from '../components/admin/CreateUserModal';
import { TeamSelector } from '../components/admin/TeamSelector';
import { Button } from '../components/ui/Button';
import { Plus, Search } from 'lucide-react';
export function UserManagement() {
  const { users, teams } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredUsers = users.filter((user) => {
    const matchesTeam =
    selectedTeamId === 'all' || user.teamIds.includes(selectedTeamId);
    const matchesSearch =
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage team members, roles, and access.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <TeamSelector
            selectedTeamId={selectedTeamId}
            onTeamChange={setSelectedTeamId}
            className="w-full md:w-auto" />

        </div>

        <UserTable users={filteredUsers} teams={teams} />
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} />

    </div>);

}