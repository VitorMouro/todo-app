import React from "react";
import { TaskEditor } from "../components/TaskEditor";
import Task from "../models/task";

const mockTask: Task = {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task description.",
    status: "pending",
    userId: "user123",
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const EditorPage: React.FC = () => {
    return (
        <TaskEditor task={mockTask} mode="create">
        </TaskEditor>
    );
}
