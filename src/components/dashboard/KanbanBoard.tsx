import React from 'react';
import { Task, TaskCard } from './TaskCard';
interface KanbanBoardProps {
  tasks: Task[];
}
export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const columns = [
  {
    id: 'todo',
    label: 'To Do'
  },
  {
    id: 'in-progress',
    label: 'In Progress'
  },
  {
    id: 'done',
    label: 'Done'
  }] as
  const;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        return (
          <div key={column.id} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">{column.label}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 bg-gray-50/50 rounded-xl p-3 space-y-3 min-h-[200px]">
              {columnTasks.map((task) =>
              <TaskCard key={task.id} task={task} />
              )}
              {columnTasks.length === 0 &&
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                  No tasks
                </div>
              }
            </div>
          </div>);

      })}
    </div>);

}