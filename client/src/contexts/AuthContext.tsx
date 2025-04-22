import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/me', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        console.log("Is authenticated:", response.data.user);
      } else {
         setUser(null);
      }
    } catch (error) {
      console.log('Not authenticated or error checking status');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
  };

// TODO: Handle logout logic
  const logout = async () => {
     setIsLoading(true);
     try {
        await axiosInstance.post('/auth/logout');
     } catch(error) {
        console.error("Logout error:", error);
     } finally {
        setUser(null);
        // clear localStorage
        // navigate('/login');
        setIsLoading(false);
     }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
