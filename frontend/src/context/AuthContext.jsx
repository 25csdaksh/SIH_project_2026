import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('krishiseva_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.data);
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('krishiseva_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const { token: jwtToken, ...newUser } = res.data;
    localStorage.setItem('krishiseva_token', jwtToken);
    setToken(jwtToken);
    setUser(newUser);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('krishiseva_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
