import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Clock, Settings, LogOut,
  Users, Shield, Briefcase, FileText 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { TeamSwitcher } from '../team/TeamSwitcher';

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const commonItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: Calendar,
      label: 'Planner',
      path: '/planner'
    },
    {
      icon: Clock,
      label: 'Time Tracking',
      path: '/time-tracking'
    }
  ];

  const hrItems = currentUser?.role === 'hr' ? [
    {
      icon: FileText,
      label: 'Timesheets',
      path: '/timesheets'
    }
  ] : [];

  const adminItems = currentUser?.role === 'admin' ? [
    {
      icon: Shield,
      label: 'Admin Overview',
      path: '/admin/dashboard'
    },
    {
      icon: Users,
      label: 'User Management',
      path: '/admin/users'
    },
    {
      icon: Briefcase,
      label: 'Team Management',
      path: '/admin/teams'
    }
  ] : [];

  const navItems = [...commonItems, ...hrItems, ...adminItems];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 z-30 hidden md:flex flex-col">
      <div className="p-6 pb-4 border-b border-gray-200 dark:border-slate-700">
        {currentUser?.role === 'member' ? (
          <TeamSwitcher />
        ) : (
          <div className="flex items-center gap-3 px-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              currentUser?.role === 'admin' ? 'bg-red-600' : 'bg-green-600'
            }`}>
              <span className="text-white font-bold text-lg">
                {currentUser?.role === 'admin' ? 'A' : 'H'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                {currentUser?.role === 'admin' ? 'Admin Console' : 'HR Dashboard'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser?.role === 'admin' ? 'Organization View' : 'Timesheet Management'}
              </span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md border-blue-200 dark:border-blue-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ✅ FIXED BOTTOM SECTION */}
      <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
        <div className="px-4 py-3 mb-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {currentUser?.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {currentUser?.email}
          </div>
        </div>
        
        {/* ✅ SETTINGS - NOW WORKS! */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md border-2 border-blue-200 dark:border-blue-800'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-200 dark:hover:border-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings className={`w-5 h-5 transition-colors ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`} />
              Settings
            </>
          )}
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 mt-2 border border-transparent hover:border-red-200"
        >
          <LogOut className="w-5 h-5 text-red-400 dark:text-red-300" />
          Logout
        </button>
      </div>
    </aside>
  );
}
