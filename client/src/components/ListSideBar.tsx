import React from 'react';
import ListItem from './ListItem';

interface List {
    id: string;
    name: string;
}

interface ListSidebarProps {
  lists: List[];
  selectedListId: string | null;
  onSelectList: (listId: string) => void;
  onAddList: () => void; // Placeholder function
  onConfig: () => void; // Placeholder function
}

const ListSidebar: React.FC<ListSidebarProps> = ({
  lists,
  selectedListId,
  onSelectList,
  onAddList,
  onConfig,
}) => {
  return (
    <aside className="flex flex-col justify-between h-full p-4 bg-blue-100 border-r border-gray-300">
      {/* List Section */}
      <div>
        {lists.map((list) => (
          <ListItem
            key={list.id}
            list={list}
            isSelected={list.id === selectedListId}
            onClick={onSelectList}
          />
        ))}
        {/* Add List Button */}
        <button
          onClick={onAddList}
          className="w-full px-4 py-2 mt-2 text-lg font-bold border border-gray-400 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors duration-150"
          aria-label="Add new list"
        >
          +
        </button>
      </div>

      {/* Config Button */}
      <button
        onClick={onConfig}
        className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors duration-150"
      >
        Config
      </button>
    </aside>
  );
};

export default ListSidebar;
