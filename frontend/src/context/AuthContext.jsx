import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // In Phase 1 foundation: mock / sample user support for testing
      const mockUser = {
        id: 'usr_student_01',
        fullName: credentials.email ? credentials.email.split('@')[0] : 'Demo Student',
        email: credentials.email || 'aarav.sharma@campus.edu',
        department: 'Computer Science & Engineering',
        role: 'student',
      };
      const mockToken = 'mock_jwt_token_phase_1_' + Date.now();

      setUser(mockUser);
      setToken(mockToken);

      localStorage.setItem('gatherly_user', JSON.stringify(mockUser));
      localStorage.setItem('gatherly_token', mockToken);

      setLoading(false);
      return { success: true, user: mockUser };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = {
        id: 'usr_' + Date.now(),
        fullName: userData.fullName || 'New Student',
        email: userData.email,
        phone: userData.phone,
        department: userData.department || 'General',
        role: 'student',
      };
      const newToken = 'mock_jwt_token_' + Date.now();

      setUser(newUser);
      setToken(newToken);

      localStorage.setItem('gatherly_user', JSON.stringify(newUser));
      localStorage.setItem('gatherly_token', newToken);

      setLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
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
        isAuthenticated: !!token,
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

