import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  // Helper to decode JWT and check expiry
  const decodeJwt = useCallback((jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      return {
        username: payload.sub,
        org: payload.org,
        exp: payload.exp * 1000, // Convert to milliseconds
      };
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }, []);

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('sentinelmesh_token');
    const savedUser = localStorage.getItem('sentinelmesh_user');
    
    if (savedToken && savedUser) {
      const decoded = decodeJwt(savedToken);
      if (decoded && decoded.exp > Date.now()) { // Check if token is still valid
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } else {
        // Token expired, clear it
        localStorage.removeItem('sentinelmesh_token');
        localStorage.removeItem('sentinelmesh_user');
        console.log('Expired token found and cleared.');
      }
    }
    setIsLoading(false);
  }, [decodeJwt]);

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

      const decoded = decodeJwt(access_token);
      if (!decoded) throw new Error('Failed to decode token');

      const userData = {
        username: decoded.username,
        org: decoded.org,
      };

      // Save to localStorage
      localStorage.setItem('sentinelmesh_token', access_token);
      localStorage.setItem('sentinelmesh_user', JSON.stringify(userData));
      // Store credentials for silent re-login (use with caution)
      localStorage.setItem('sentinelmesh_username', username);
      localStorage.setItem('sentinelmesh_password', password);

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

      const errorData = await response.json().catch(() => null);
      
      if (!response.ok) {
        console.error('Registration failed:', response.status, errorData);
        throw new Error(errorData?.detail || errorData?.error || errorData?.message || `Registration failed (${response.status})`);
      }

      // After successful registration, automatically log in
      await login(username, password);
      
      return errorData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('sentinelmesh_token');
    localStorage.removeItem('sentinelmesh_user');
    localStorage.removeItem('sentinelmesh_username'); // Clear stored credentials
    localStorage.removeItem('sentinelmesh_password'); // Clear stored credentials
    setToken(null);
    setUser(null);
  };

  // Function to make authenticated API requests with retry logic
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    let currentToken = token;

    // Check if token is expired or close to expiring (e.g., within 5 minutes)
    const decoded = currentToken ? decodeJwt(currentToken) : null;
    const isTokenExpired = !decoded || decoded.exp < Date.now() + (5 * 60 * 1000); // 5 minutes buffer

    if (isTokenExpired) {
      console.log('Token expired or near expiry. Attempting silent re-login...');
      const storedUsername = localStorage.getItem('sentinelmesh_username');
      const storedPassword = localStorage.getItem('sentinelmesh_password');

      if (storedUsername && storedPassword) {
        try {
          // Attempt to re-login silently
          const newUserData = await login(storedUsername, storedPassword);
          currentToken = localStorage.getItem('sentinelmesh_token'); // Get the new token
          console.log('Silent re-login successful.');
        } catch (reloginError) {
          console.error('Silent re-login failed:', reloginError);
          logout(); // If silent re-login fails, force logout
          throw new Error('Session expired. Please log in again.');
        }
      } else {
        logout(); // No stored credentials for silent re-login
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!currentToken) {
      logout(); // Should not happen if silent re-login worked or token was valid
      throw new Error('No authentication token available after refresh attempt.');
    }

    const headers = {
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      console.log('Received 401. Attempting re-login and retry...');
      const storedUsername = localStorage.getItem('sentinelmesh_username');
      const storedPassword = localStorage.getItem('sentinelmesh_password');

      if (storedUsername && storedPassword) {
        try {
          // Attempt to re-login silently again
          const newUserData = await login(storedUsername, storedPassword);
          currentToken = localStorage.getItem('sentinelmesh_token'); // Get the new token
          console.log('Re-login successful, retrying request.');

          // Retry the original request with the new token
          const retryHeaders = {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
          };
          response = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });

          if (response.status === 401) {
            // Still 401 after retry, force logout
            logout();
            throw new Error('Session expired after retry. Please log in again.');
          }

        } catch (reloginError) {
          console.error('Re-login for retry failed:', reloginError);
          logout();
          throw new Error('Session expired. Please log in again.');
        }
      } else {
        logout(); // No stored credentials for re-login
        throw new Error('Session expired. Please log in again.');
      }
    }

    return response;
  }, [token, API_BASE, login, logout, decodeJwt]);

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

