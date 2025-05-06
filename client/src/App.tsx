import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/route/ProtectedRoute';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/:projectId" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
}

export default App
