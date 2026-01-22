import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Users } from 'lucide-react';
interface TeamSelectorProps {
  selectedTeamId: string | 'all';
  onTeamChange: (teamId: string) => void;
  showAllOption?: boolean;
  className?: string;
}
export function TeamSelector({
  selectedTeamId,
  onTeamChange,
  showAllOption = true,
  className = ''
}: TeamSelectorProps) {
  const { teams } = useData();
  return (
    <div className={`relative ${className}`}>
      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <select
        value={selectedTeamId}
        onChange={(e) => onTeamChange(e.target.value)}
        className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[160px]">

        {showAllOption && <option value="all">All Teams</option>}
        {teams.map((team) =>
        <option key={team.id} value={team.id}>
            {team.name}
          </option>
        )}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7" />

        </svg>
      </div>
    </div>);

}