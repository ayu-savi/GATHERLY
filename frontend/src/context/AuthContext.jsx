import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('gatherly_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('gatherly_token') || null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Validate session on initial load
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('gatherly_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res && res.data) {
          setUser(res.data);
          localStorage.setItem('gatherly_user', JSON.stringify(res.data));
        }
      } catch (err) {
        // Token expired or invalid
        console.warn('Session verification error:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res && res.data) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setUser(receivedUser);
        setToken(receivedToken);

        localStorage.setItem('gatherly_user', JSON.stringify(receivedUser));
        localStorage.setItem('gatherly_token', receivedToken);

        setLoading(false);
        return { success: true, user: receivedUser };
      }
      throw new Error(res.message || 'Authentication failed');
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res && res.data) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setUser(receivedUser);
        setToken(receivedToken);

        localStorage.setItem('gatherly_user', JSON.stringify(receivedUser));
        localStorage.setItem('gatherly_token', receivedToken);

        setLoading(false);
        return { success: true, user: receivedUser };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gatherly_user');
    localStorage.removeItem('gatherly_token');
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('gatherly_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
