import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // API base URL
  const API_BASE = import.meta.env.VITE_API_BASE || 'https://sentinelmesh-api.onrender.com';

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('sentinelmesh_token');
    const savedUser = localStorage.getItem('sentinelmesh_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Login failed');
      }

      const data = await response.json();
      const { access_token } = data;

      // Decode the JWT to get user info (simple base64 decode)
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const userData = {
        username: payload.sub,
        org: payload.org,
      };

      // Save to localStorage
      localStorage.setItem('sentinelmesh_token', access_token);
      localStorage.setItem('sentinelmesh_user', JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username, password, org) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          org,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // After successful registration, automatically log in
      await login(username, password);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('sentinelmesh_token');
    localStorage.removeItem('sentinelmesh_user');
    setToken(null);
    setUser(null);
  };

  // Function to make authenticated API requests
  const authenticatedFetch = async (url, options = {}) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid, logout user
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    authenticatedFetch,
    API_BASE,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

