import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { DraggableCard, PlannerTask } from './DraggableCard';
import { Plus } from 'lucide-react';
interface ColumnProps {
  id: string;
  title: string;
  tasks: PlannerTask[];
  color?: string;
}
export function Column({
  id,
  title,
  tasks,
  color = 'bg-gray-200'
}: ColumnProps) {
  return (
    <div className="flex flex-col h-full min-w-[280px] w-full md:w-80">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-md transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) =>
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 bg-gray-50/50 rounded-xl p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50 ring-2 ring-blue-100' : ''}`}>

            {tasks.map((task, index) =>
          <DraggableCard key={task.id} task={task} index={index} />
          )}
            {provided.placeholder}

            <button className="w-full py-2 mt-2 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg border border-dashed border-gray-200 hover:border-gray-300 transition-all">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        }
      </Droppable>
    </div>);

}