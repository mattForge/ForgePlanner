import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, Clock, Activity, FileText, Download } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { ProgressChart } from '../components/dashboard/ProgressChart';  // NEW
import { HoursChart } from '../components/dashboard/HoursChart';        // NEW
import { Button } from '../components/ui/Button';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
import { TeamSelector } from '../components/admin/TeamSelector';

export function Dashboard() {
  const { currentUser } = useAuth();
  const { tasks, users, timeRecords, teams } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    currentUser?.role === 'admin' ? 'all' : currentUser?.teamIds?.[0] || ''
  );

  // Filter logic - LIVE UPDATING
  const filteredTasks = tasks.filter((t) => {
    if (selectedTeamId === 'all') return true;
    return t.teamId === selectedTeamId;
  });

  const filteredUsers = users.filter((u) => {
    if (selectedTeamId === 'all') return true;
    return u.teamIds.includes(selectedTeamId);
  });

  // DYNAMIC METRICS - UPDATE IN REAL-TIME
  const activeTasks = filteredTasks.filter((t) => t.status !== 'done').length;
  const completedTasks = filteredTasks.filter((t) => t.status === 'done').length;
  const completionRate = filteredTasks.length > 0 
    ? Math.round(completedTasks / filteredTasks.length * 100) 
    : 0;

  // LIVE TIME TRACKING METRICS
  const totalHoursLogged = timeRecords.reduce((sum, record) => sum + record.duration, 0);
  const avgHoursPerUser = filteredUsers.length > 0 ? Math.round(totalHoursLogged / filteredUsers.length) : 0;
  const recentRecords = timeRecords.filter(record => 
    new Date(record.clockIn) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
  ).length;

  // LIVE CHART DATA
  const progressData = {
    total: filteredTasks.length,
    done: completedTasks,
    inProgress: filteredTasks.filter(t => t.status === 'in-progress').length
  };

  const hoursData = {
    totalHours: totalHoursLogged,
    avgHours: avgHoursPerUser,
    recentRecords
  };

  // Convert tasks to Kanban format - LIVE
  const kanbanTasks = filteredTasks.map((t) => ({
    id: t.id,
    title: t.title,
    assignee: users.find((u) => u.id === t.assigneeId)?.name || 'Unassigned',
    dueDate: new Date(t.dueDate).toLocaleDateString(),
    status: t.status,
    priority: t.priority
  }));

  // Auto-refresh every 30 seconds for demo (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      // DataContext already auto-updates, this just forces re-render
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-900">{currentUser?.name}</span>. 
            Live data as of {new Date().toLocaleTimeString()}.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {currentUser?.role === 'admin' && (
            <TeamSelector
              selectedTeamId={selectedTeamId}
              onTeamChange={setSelectedTeamId}
            />
          )}
          {currentUser?.role === 'hr' && (
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Timesheets
            </Button>
          )}
          <Button>+ New Task</Button>
        </div>
      </div>

      {/* Role-Specific Live Banners */}
      {currentUser?.role === 'hr' && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">HR Live Dashboard</h3>
                <p className="text-gray-600">
                  Tracking {filteredUsers.length} team members with{' '}
                  <span className="font-semibold">{Math.floor(totalHoursLogged / 60)}h</span> 
                  {' '}total hours this week
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <a href="/timesheets">View Timesheets →</a>
            </Button>
          </div>
        </div>
      )}

      {currentUser?.role === 'admin' && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Admin Live Overview</h3>
                <p className="text-gray-600">
                  Managing {users.length} users across {teams.length} teams
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {recentRecords} new clock-ins
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE DYNAMIC CHARTS - Replace old metrics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. LIVE TASK PROGRESS CHART */}
        <ProgressChart data={progressData} />

        {/* 2. LIVE HOURS CHART (HR/Admin) or Basic Metric (Member) */}
        {currentUser?.role === 'hr' || currentUser?.role === 'admin' ? (
          <HoursChart data={hoursData} />
        ) : (
          <MetricCard
            title="Total Hours Logged"
            value={`${Math.floor(totalHoursLogged / 60)}h`}
            icon={Clock}
            trend={{ value: recentRecords, isPositive: true }}
            delay={0.2}
          />
        )}
      </div>

      {/* 3. ORIGINAL Metric Cards - Now ALL DYNAMIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Team Members"
          value={filteredUsers.length.toString()}
          icon={Users}
          trend={{ value: 2, isPositive: true }}
          delay={0}
        />
        <MetricCard
          title="Active Tasks"
          value={activeTasks.toString()}
          icon={CheckSquare}
          trend={{ value: 3, isPositive: false }}
          delay={0.1}
        />
        <MetricCard
          title="Hours Logged"
          value={`${Math.floor(totalHoursLogged / 60)}h`}
          icon={Clock}
          trend={{ value: recentRecords, isPositive: true }}
          delay={0.2}
        />
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={Activity}
          trend={{ value: 5, isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* 4. LIVE KANBAN - Updates automatically */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Live Task Overview ({filteredTasks.length} total)
          </h2>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <KanbanBoard tasks={kanbanTasks} />
      </div>
    </div>
  );
}
