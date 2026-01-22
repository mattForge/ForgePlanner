import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Column } from '../components/planner/Column';
import { Button } from '../components/ui/Button';
import { Filter, Search, Plus } from 'lucide-react';
import { useData, TaskStatus } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
import { TeamSelector } from '../components/admin/TeamSelector';
const COLUMN_CONFIG: {
  id: TaskStatus;
  title: string;
  color: string;
}[] = [
{
  id: 'todo',
  title: 'To Do',
  color: 'bg-gray-400'
},
{
  id: 'in-progress',
  title: 'In Progress',
  color: 'bg-blue-500'
},
{
  id: 'review',
  title: 'Review',
  color: 'bg-yellow-500'
},
{
  id: 'done',
  title: 'Done',
  color: 'bg-green-500'
}];

export function Planner() {
  const { tasks, updateTask, addTask, users } = useData();
  const { currentUser } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    currentUser?.role === 'admin' ? 'all' : currentUser?.teamIds[0] || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesTeam = selectedTeamId === 'all' || t.teamId === selectedTeamId;
    const matchesSearch = t.title.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index)
    {
      return;
    }
    // Update task status
    updateTask(draggableId, {
      status: destination.droppableId as TaskStatus
    });
  };
  const handleAddTask = () => {
    const teamId =
    selectedTeamId === 'all' ? currentUser?.teamIds[0] : selectedTeamId;
    if (!teamId) return alert('Please select a team first');
    const title = prompt('Enter task title:');
    if (title) {
      addTask({
        title,
        status: 'todo',
        priority: 'medium',
        teamId,
        assigneeId: currentUser?.id || '',
        dueDate: new Date().toISOString()
      });
    }
  };
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Project Planner
          </h1>
          <p className="text-gray-500 mt-1">
            Manage tasks and track progress across the team.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {currentUser?.role === 'admin' &&
          <TeamSelector
            selectedTeamId={selectedTeamId}
            onTeamChange={setSelectedTeamId} />

          }

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />

          </div>

          <Button onClick={handleAddTask} className="gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-6 h-full min-w-max px-1">
            {COLUMN_CONFIG.map((col) => {
              const columnTasks = filteredTasks.
              filter((t) => t.status === col.id).
              map((t) => ({
                id: t.id,
                content: t.title,
                assignee:
                users.find((u) => u.id === t.assigneeId)?.name ||
                'Unassigned',
                tag: t.priority,
                dueDate: new Date(t.dueDate).toLocaleDateString()
              }));
              return (
                <Column
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={columnTasks}
                  color={col.color} />);


            })}
          </div>
        </div>
      </DragDropContext>
    </div>);

}