import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Badge } from '../ui/Badge';
export interface PlannerTask {
  id: string;
  content: string;
  assignee: string;
  tag: string;
  dueDate: string;
}
interface DraggableCardProps {
  task: PlannerTask;
  index: number;
}
export function DraggableCard({ task, index }: DraggableCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) =>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3 group transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500/20 rotate-2' : 'hover:border-blue-300'}`}
        style={provided.draggableProps.style}>

          <div className="flex justify-between items-start mb-2">
            <Badge variant="blue" className="text-[10px] px-2 py-0.5">
              {task.tag}
            </Badge>
            <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-medium text-gray-900 mb-3">
            {task.content}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700">
                {task.assignee.charAt(0)}
              </div>
              <span className="text-xs text-gray-500">{task.assignee}</span>
            </div>
            {task.dueDate &&
          <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{task.dueDate}</span>
              </div>
          }
          </div>
        </div>
      }
    </Draggable>);

}