import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService, AuthResponse, LoginData, RegisterData } from '../services/userService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginData) => {
    try {
      const response: AuthResponse = await userService.login(credentials);
      if (response && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error('Login failed: No user or token returned');
      }
    } catch (error: any) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response: AuthResponse = await userService.register(userData);
      if (response && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        throw new Error('Registration failed: No user or token returned');
      }
    } catch (error) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
