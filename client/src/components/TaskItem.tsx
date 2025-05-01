// src/components/TaskItem.tsx
import React from 'react';

interface Task {
  id: string;
  name: string;
  listId: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  isSelected: boolean; // To potentially highlight the selected task
  onToggleComplete: (taskId: string) => void;
  onClick: (taskId: string) => void; // To select the task for details view
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, onToggleComplete, onClick }) => {
  const containerClasses = `flex items-center p-3 mb-3 border border-gray-400 rounded-lg cursor-pointer transition-colors duration-150 ${
    isSelected ? 'bg-yellow-300 shadow-md' : 'bg-yellow-100 hover:bg-yellow-200'
  }`;
  const textClasses = task.completed ? 'line-through text-gray-500' : 'text-gray-800';

  return (
    <div
      onClick={() => onClick(task.id)}
      className={containerClasses}
      role="button" // Improve accessibility
      tabIndex={0}  // Make it focusable
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(task.id); }} // Keyboard accessibility
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => {
            e.stopPropagation(); // Prevent onClick on the container from firing
            onToggleComplete(task.id);
        }}
        className="mr-3 h-5 w-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
        aria-labelledby={`task-label-${task.id}`} // Accessibility
      />
      <span id={`task-label-${task.id}`} className={`flex-grow ${textClasses}`}>
        {task.name}
      </span>
    </div>
  );
};

export default TaskItem;
