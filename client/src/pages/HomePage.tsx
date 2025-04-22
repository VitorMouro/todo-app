// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <p>Helooooo Welcome to the application!</p>
      <nav className="mt-4 space-x-4">
        <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard (Protected)</Link>
      </nav>
    </div>
  );
};

export default HomePage;
