// User Management API utilities

const API_BASE = '/api';

// Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Handle API response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// User API functions
export const userApi = {
  // Get all users (admin only)
  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.org) params.append('org', filters.org);
    if (filters.role) params.append('role', filters.role);
    
    const url = `${API_BASE}/users${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get specific user by ID
  async getUser(userId) {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get current user info
  async getCurrentUser() {
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create new user (admin only)
  async createUser(userData) {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Update user (admin or self)
  async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Update current user
  async updateCurrentUser(userData) {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Delete user (admin only)
  async deleteUser(userId) {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // User registration (public)
  async register(userData) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // User login (public)
  async login(credentials) {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },
};

// Utility functions for user management
export const userUtils = {
  // Check if current user is admin
  isAdmin() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role === 'admin';
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
    return false;
  },

  // Get current user info from token
  getCurrentUserFromToken() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    return null;
  },

  // Check if token is expired
  isTokenExpired() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
    return true;
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // Format role for display
  formatRole(role) {
    return role === 'admin' ? 'Administrator' : 'User';
  },

  // Get role badge variant
  getRoleBadgeVariant(role) {
    return role === 'admin' ? 'destructive' : 'secondary';
  },

  // Validate user data
  validateUserData(userData, isUpdate = false) {
    const errors = {};

    if (!userData.username || userData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }

    if (!isUpdate || userData.password) {
      if (!userData.password || userData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
    }

    if (!userData.org || userData.org.trim().length < 2) {
      errors.org = 'Organization must be at least 2 characters long';
    }

    if (!userData.role || !['user', 'admin'].includes(userData.role)) {
      errors.role = 'Role must be either "user" or "admin"';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Filter users based on search and filters
  filterUsers(users, searchTerm, roleFilter, orgFilter) {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.org.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesOrg = orgFilter === 'all' || user.org === orgFilter;
      
      return matchesSearch && matchesRole && matchesOrg;
    });
  },

  // Get unique organizations from users list
  getUniqueOrganizations(users) {
    return [...new Set(users.map(user => user.org))];
  },

  // Get user statistics
  getUserStats(users) {
    const totalUsers = users.length;
    const adminCount = users.filter(user => user.role === 'admin').length;
    const userCount = users.filter(user => user.role === 'user').length;
    const orgCount = this.getUniqueOrganizations(users).length;

    return {
      totalUsers,
      adminCount,
      userCount,
      orgCount,
      adminPercentage: totalUsers > 0 ? Math.round((adminCount / totalUsers) * 100) : 0,
      userPercentage: totalUsers > 0 ? Math.round((userCount / totalUsers) * 100) : 0,
    };
  },
};

export default userApi;

