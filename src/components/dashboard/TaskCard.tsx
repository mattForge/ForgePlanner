import React from 'react';
import { Badge } from '../ui/Badge';
import { Clock, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}
interface TaskCardProps {
  task: Task;
}
export function TaskCard({ task }: TaskCardProps) {
  const statusColors = {
    todo: 'neutral',
    'in-progress': 'blue',
    done: 'success'
  } as const;
  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-50 text-yellow-700',
    high: 'bg-red-50 text-red-700'
  };
  return (
    <motion.div
      className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
      whileHover={{
        y: -2
      }}>

      <div className="flex justify-between items-start mb-3">
        <Badge variant={statusColors[task.status]}>
          {task.status.replace('-', ' ')}
        </Badge>
        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
        {task.title}
      </h4>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            {task.assignee.charAt(0)}
          </div>
          <span>{task.assignee}</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </div>
      </div>
    </motion.div>);

}