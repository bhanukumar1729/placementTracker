import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'company' | null
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on app mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedRole && storedUser) {
      try {
        setToken(storedToken);
        setRole(storedRole);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to restore session:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password, loginRole) => {
    const endpoint =
      loginRole === 'company'
        ? '/auth/company/login'
        : '/auth/student/login';

    const response = await api.post(endpoint, { email, password });
    const { token: newToken, user: newUser } = response.data;

    setToken(newToken);
    setRole(loginRole);
    setUser(newUser);

    localStorage.setItem('token', newToken);
    localStorage.setItem('role', loginRole);
    localStorage.setItem('user', JSON.stringify(newUser));

    return newUser;
  };

  // Register handler
  const register = async (formData, registerRole) => {
    const endpoint =
      registerRole === 'company'
        ? '/auth/company/register'
        : '/auth/student/register';

    const response = await api.post(endpoint, formData);
    const { token: newToken, user: newUser } = response.data;

    setToken(newToken);
    setRole(registerRole);
    setUser(newUser);

    localStorage.setItem('token', newToken);
    localStorage.setItem('role', registerRole);
    localStorage.setItem('user', JSON.stringify(newUser));

    return newUser;
  };

  // Update user in state and storage
  const updateUserProfile = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!token,
        isStudent: role === 'student',
        isCompany: role === 'company',
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
