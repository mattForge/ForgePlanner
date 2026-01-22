import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Clock, Settings, LogOut,
  Users, Shield, Briefcase, FileText // ✅ NEW: FileText for HR
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
      path: '/dashboard' // ✅ FIXED: was '/'
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30 hidden md:flex flex-col">
      <div className="p-6 pb-4">
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
              <span className="text-sm font-bold text-gray-900 tracking-tight">
                {currentUser?.role === 'admin' ? 'Admin Console' : 'HR Dashboard'}
              </span>
              <span className="text-xs text-gray-500">
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
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
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

      <div className="p-4 border-t border-gray-100">
        <div className="px-4 py-2 mb-2">
          <div className="text-sm font-medium text-gray-900">
            {currentUser?.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {currentUser?.email}
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          Logout
        </button>
      </div>
    </aside>
  );
}
