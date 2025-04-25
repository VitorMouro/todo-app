// This page will show the dashboard for a authenticated user.
// It will include a list of the user's folders (or projects or notebooks)
// Each folder contains a list of markdown documents.

import React from "react";

const Dashboard: React.FC = () => {
    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to the dashboard!</p>
        </div>
    );
}

export default Dashboard;
