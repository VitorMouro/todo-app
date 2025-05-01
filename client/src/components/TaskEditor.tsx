import React from "react";
import Task from "../models/task";

interface TaskEditorProps {
    task: Task | undefined | null;
    mode: 'create' | 'edit' | 'view';
}

export const TaskEditor: React.FC<TaskEditorProps> = ({task, mode}) => {
    return (
        <div>
            <h1>{mode === 'create' ? 'Create Task' : mode === 'edit' ? 'Edit Task' : 'View Task'}</h1>
            <input type="text" placeholder="Task Title" value={task?.title || ''} readOnly={mode === 'view'} />
        </div>
    );
}
