import React from 'react';

interface Task {
    id: string;
    name: string;
    listId: string;
    completed: boolean;
}

interface TaskDetailProps {
  task: Task | null | undefined; // Can be null/undefined if no task is selected
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  return (
    <div className="flex items-center justify-center h-full p-6 bg-gray-50 border-l border-gray-300">
      {task ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{task.name}</h2>
          <p className="text-gray-600">Details for this task would appear here.</p>
          {/* Add more details like description, due date, etc. */}
          <p className="mt-2">Status: {task.completed ? 'Completed' : 'Pending'}</p>
        </div>
      ) : (
        <p className="text-gray-500">Select a task to view</p>
      )}
    </div>
  );
};

export default TaskDetail;
