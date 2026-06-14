import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const updateUser = (userData, newToken) => {
    setUser(userData);
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      updateUser(res.data.user, res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      updateUser(res.data.user, res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (code) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-email', { code });
      updateUser(res.data.user, res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await axios.post('/api/auth/resend-code');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to resend code' };
    }
  };

  const googleLogin = async (credential) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/google', { credential });
      updateUser(res.data.user, res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Google login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = user?.role === 'admin';
  const isVerified = user?.isVerified ?? true;

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout,
      verifyEmail, resendCode, googleLogin,
      isAdmin, isVerified,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
