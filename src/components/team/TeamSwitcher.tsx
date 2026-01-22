import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../contexts/DataContext';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function TeamSwitcher() {
  const { currentUser } = useAuth();
  const { teams } = useData();
  const [isOpen, setIsOpen] = useState(false);
  // In a real app, we might store the "active" team in context/local state
  // For now, we'll just show the user's teams
  if (!currentUser) return null;
  const userTeams = teams.filter((t) => currentUser.teamIds.includes(t.id));
  const currentTeam = userTeams[0]; // Default to first team for display
  if (userTeams.length <= 1) {
    return (
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {currentTeam?.name.charAt(0) || 'T'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 tracking-tight">
            {currentTeam?.name || 'TeamFlow'}
          </span>
          <span className="text-xs text-gray-500">Free Plan</span>
        </div>
      </div>);

  }
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors text-left">

        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {currentTeam?.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <span className="text-sm font-bold text-gray-900 tracking-tight block">
            {currentTeam?.name}
          </span>
          <span className="text-xs text-gray-500">Switch Team</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />

      </button>

      <AnimatePresence>
        {isOpen &&
        <>
            <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)} />

            <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: 10
            }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">

              <div className="p-2">
                <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                  Your Teams
                </div>
                {userTeams.map((team) =>
              <button
                key={team.id}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                        {team.name.charAt(0)}
                      </div>
                      {team.name}
                    </div>
                    {team.id === currentTeam?.id &&
                <Check className="w-4 h-4 text-blue-600" />
                }
                  </button>
              )}
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}
