import React, { createContext, useContext, useEffect, useState } from 'react';
import type { TravelUser } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: TravelUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: TravelUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TravelUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('traveloop_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('traveloop_token');
      if (savedToken) {
        try {
          const { data } = await authService.getMe();
          setUser(data.user);
        } catch {
          localStorage.removeItem('traveloop_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('traveloop_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authService.register({ name, email, password });
    localStorage.setItem('traveloop_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('traveloop_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: TravelUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
