import React from 'react';
import TaskItem from './TaskItem';

interface Task {
    id: string;
    name: string;
    listId: string;
    completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onToggleComplete: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTaskId, onToggleComplete, onSelectTask }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No tasks in this list.
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full bg-white">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={task.id === selectedTaskId}
          onToggleComplete={onToggleComplete}
          onClick={onSelectTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
