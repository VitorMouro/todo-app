import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
              <CookiesProvider>
                <App />
              </CookiesProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
