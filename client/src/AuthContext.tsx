import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from './axiosInstance';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  // logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until auth check is done

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Example: Endpoint that returns user data if session is valid
      const response = await axiosInstance.get('/auth/me');
      if (response.data && response.data.user) {
        setUser(response.data.user);
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

  // Check auth status on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Optionally store token or user data in localStorage if not using httpOnly cookies
  };

  // const logout = async () => {
  //    setIsLoading(true);
  //    try {
  //       // Call backend logout endpoint (important to destroy server session)
  //       await axiosInstance.post('/auth/logout');
  //    } catch(error) {
  //       console.error("Logout error:", error);
  //    } finally {
  //       setUser(null);
  //       // Optionally clear localStorage if used
  //       // navigate('/login'); // Consider navigation logic placement
  //       setIsLoading(false);
  //    }
  // };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    // logout,
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
