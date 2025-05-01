import React from 'react';

interface List {
    id: string;
    name: string;
}

interface ListItemProps {
  list: List;
  isSelected: boolean;
  onClick: (listId: string) => void;
}

const ListItem: React.FC<ListItemProps> = ({ list, isSelected, onClick }) => {
  const baseClasses = "w-full text-left px-4 py-2 mb-2 border border-gray-400 rounded-md focus:outline-none transition-colors duration-150";
  const selectedClasses = "bg-white font-semibold shadow-sm";
  const normalClasses = "bg-gray-100 hover:bg-gray-200";

  return (
    <button
      onClick={() => onClick(list.id)}
      className={`${baseClasses} ${isSelected ? selectedClasses : normalClasses}`}
    >
      {list.name}
    </button>
  );
};

export default ListItem;
