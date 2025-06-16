'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (mock authentication)
    const storedUser = localStorage.getItem('pennywise_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    if (email && password) {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email,
        joinDate: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('pennywise_user', JSON.stringify(mockUser));
      router.push('/dashboard');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (name, email, password) => {
    // Mock registration logic
    if (name && email && password) {
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        joinDate: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('pennywise_user', JSON.stringify(mockUser));
      router.push('/dashboard');
      return { success: true };
    }
    return { success: false, error: 'All fields are required' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pennywise_user');
    router.push('/');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}