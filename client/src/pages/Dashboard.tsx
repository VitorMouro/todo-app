import { useState, useMemo } from 'react';
import Header from '../components/HeaderBar';
import ListSidebar from '../components/ListSideBar';
import TaskList from '../components/TaskList';
import TaskDetail from '../components/TaskDetail';

interface List {
    id: string;
    name: string;
}

interface Task {
    id: string;
    name: string;
    listId: string;
    completed: boolean;
}

const mockLists = [
    { id: 'list-1', name: 'Work' },
    { id: 'list-2', name: 'Personal' },
    { id: 'list-3', name: 'Shopping' },
];

const mockTasks = [
    { id: 'task-1', name: 'Task 1', listId: 'list-1', completed: false },
    { id: 'task-2', name: 'Task 2', listId: 'list-1', completed: true },
    { id: 'task-3', name: 'Task 3', listId: 'list-2', completed: false },
    { id: 'task-4', name: 'Task 4', listId: 'list-3', completed: true },
];

export default function DashBoard() {
  const [lists, setLists] = useState<List[]>(mockLists);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedListId, setSelectedListId] = useState<string | null>(mockLists[0]?.id ?? null); // Select first list initially
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // --- State Updaters ---

  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
    setSelectedTaskId(null); // Reset task selection when list changes
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
     // Optionally deselect task on completion or keep it selected
     // if (selectedTaskId === taskId) setSelectedTaskId(null);
  };

  // Placeholder functions for add/config
  const handleAddList = () => {
    console.log("Add List clicked");
    // Implement logic to add a new list
    const newListId = `list-${Date.now()}`;
    const newList: List = { id: newListId, name: `New List ${lists.length + 1}` };
    setLists(prev => [...prev, newList]);
    setSelectedListId(newListId); // Optionally select the new list
  };

  const handleConfig = () => {
    console.log("Config clicked");
    // Implement logic for configuration
  };

  // --- Derived State ---

  const selectedList = useMemo(() => {
    return lists.find(list => list.id === selectedListId) ?? null;
  }, [lists, selectedListId]);

  const tasksForSelectedList = useMemo(() => {
    return tasks.filter(task => task.listId === selectedListId);
  }, [tasks, selectedListId]);

  const selectedTask = useMemo(() => {
    return tasks.find(task => task.id === selectedTaskId) ?? null;
   }, [tasks, selectedTaskId]);


  // --- Render ---

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <Header selectedListName={selectedList?.name ?? null} />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-[250px_1fr_1fr] overflow-hidden"> {/* Responsive Grid */}
        {/* List Sidebar */}
        <ListSidebar
          lists={lists}
          selectedListId={selectedListId}
          onSelectList={handleSelectList}
          onAddList={handleAddList}
          onConfig={handleConfig}
        />

        {/* Task List */}
        {selectedListId ? (
          <TaskList
            tasks={tasksForSelectedList}
            selectedTaskId={selectedTaskId}
            onToggleComplete={handleToggleComplete}
            onSelectTask={handleSelectTask}
          />
        ) : (
           <div className="flex items-center justify-center h-full p-6 bg-white">
                <p className="text-gray-500">Select a list to see tasks.</p>
           </div>
        )}


        {/* Task Detail */}
        <TaskDetail task={selectedTask} />
      </div>
    </div>
  );
}
