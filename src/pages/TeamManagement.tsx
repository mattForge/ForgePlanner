import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CreateTeamModal } from '../components/admin/CreateTeamModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Plus, Users, Trash2 } from 'lucide-react';
export function TeamManagement() {
  const { teams, users, deleteTeam } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getMemberCount = (teamId: string) => {
    return users.filter((u) => u.teamIds.includes(teamId)).length;
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Team Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage teams within your organization.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) =>
        <Card key={team.id} className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                {team.name.charAt(0)}
              </div>
              <button
              onClick={() => {
                if (
                confirm(`Are you sure you want to delete ${team.name}?`))
                {
                  deleteTeam(team.id);
                }
              }}
              className="text-gray-400 hover:text-red-600 transition-colors">

                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {team.name}
            </h3>
            <p className="text-gray-500 text-sm mb-6 flex-1">
              {team.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{getMemberCount(team.id)} Members</span>
              </div>
              <Button variant="ghost" size="sm">
                Edit Details
              </Button>
            </div>
          </Card>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all group">

          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
          </div>
          <span className="font-medium text-gray-600 group-hover:text-blue-700">
            Create New Team
          </span>
        </button>
      </div>

      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} />

    </div>);

}