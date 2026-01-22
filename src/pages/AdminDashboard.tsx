import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { TeamSelector } from '../components/admin/TeamSelector';
import { Card } from '../components/ui/Card';
import { Users, CheckSquare, Clock, Activity, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
export function AdminDashboard() {
  const { users, teams, tasks, timeRecords } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  // Filter data based on selection
  const filteredUsers =
  selectedTeamId === 'all' ?
  users :
  users.filter((u) => u.teamIds.includes(selectedTeamId));
  const filteredTasks =
  selectedTeamId === 'all' ?
  tasks :
  tasks.filter((t) => t.teamId === selectedTeamId);
  const filteredTimeRecords =
  selectedTeamId === 'all' ?
  timeRecords :
  timeRecords.filter((r) => r.teamId === selectedTeamId);
  // Calculate metrics
  const totalMembers = filteredUsers.length;
  const activeTasks = filteredTasks.filter((t) => t.status !== 'done').length;
  const completedTasks = filteredTasks.filter((t) => t.status === 'done').length;
  const completionRate =
  filteredTasks.length > 0 ?
  Math.round(completedTasks / filteredTasks.length * 100) :
  0;
  const totalHours =
  filteredTimeRecords.reduce((acc, curr) => acc + (curr.duration || 0), 0) /
  60;
  // Chart Data: Tasks by Status
  const taskStatusData = [
  {
    name: 'To Do',
    value: filteredTasks.filter((t) => t.status === 'todo').length
  },
  {
    name: 'In Progress',
    value: filteredTasks.filter((t) => t.status === 'in-progress').length
  },
  {
    name: 'Review',
    value: filteredTasks.filter((t) => t.status === 'review').length
  },
  {
    name: 'Done',
    value: filteredTasks.filter((t) => t.status === 'done').length
  }];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Executive Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor performance across all teams and projects.
          </p>
        </div>
        <div className="flex gap-3">
          <TeamSelector
            selectedTeamId={selectedTeamId}
            onTeamChange={setSelectedTeamId} />

        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Members"
          value={totalMembers.toString()}
          icon={Users}
          trend={{
            value: 12,
            isPositive: true
          }}
          delay={0} />

        <MetricCard
          title="Active Tasks"
          value={activeTasks.toString()}
          icon={CheckSquare}
          trend={{
            value: 5,
            isPositive: false
          }}
          delay={0.1} />

        <MetricCard
          title="Hours Logged"
          value={`${Math.round(totalHours)}h`}
          icon={Clock}
          trend={{
            value: 8,
            isPositive: true
          }}
          delay={0.2} />

        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={Activity}
          trend={{
            value: 2,
            isPositive: true
          }}
          delay={0.3} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Progress Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Task Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{
                    fill: '#F3F4F6'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />

                <Bar
                  dataKey="value"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={40} />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity / Team Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Team Performance
          </h3>
          <div className="space-y-6">
            {teams.map((team, index) => {
              const teamTasks = tasks.filter((t) => t.teamId === team.id);
              const teamCompleted = teamTasks.filter(
                (t) => t.status === 'done'
              ).length;
              const teamRate =
              teamTasks.length > 0 ?
              Math.round(teamCompleted / teamTasks.length * 100) :
              0;
              if (selectedTeamId !== 'all' && team.id !== selectedTeamId)
              return null;
              return (
                <div key={team.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {team.name}
                    </span>
                    <span className="text-gray-500">{teamRate}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${teamRate}%`
                      }} />

                  </div>
                </div>);

            })}
          </div>
        </Card>
      </div>
    </div>);

}