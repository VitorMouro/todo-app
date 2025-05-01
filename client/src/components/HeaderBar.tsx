import React from 'react';

interface HeaderProps {
  selectedListName: string | null;
}

const Header: React.FC<HeaderProps> = ({ selectedListName }) => {
  const title = selectedListName ? `Tasks - ${selectedListName}` : 'Tasks';

  return (
    <header className="flex items-center justify-between p-3 border-b border-gray-300 bg-white">
      <div className="flex items-center">
         {/* Placeholder for a potential menu icon like in the mockup */}
        <button className="mr-3 text-gray-600 hover:text-gray-800">
           {/* You can replace this with an actual SVG icon */}
          ☰ 
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>
       {/* Placeholder for potential header controls (like the green circle) */}
      <div className="w-5 h-5 bg-green-500 rounded-full"></div>
    </header>
  );
};

export default Header;
