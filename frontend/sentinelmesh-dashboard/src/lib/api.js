import { useAuth } from "../AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = {
  async request(method, url, data = null, requiresAuth = true) {
    const { token } = useAuth(); // Access token from AuthContext

    const headers = {
      "Content-Type": "application/json",
    };

    if (requiresAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method: method,
      headers: headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
      }

      return response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  },

  get(url, requiresAuth = true) {
    return this.request("GET", url, null, requiresAuth);
  },

  post(url, data, requiresAuth = true) {
    return this.request("POST", url, data, requiresAuth);
  },

  put(url, data, requiresAuth = true) {
    return this.request("PUT", url, data, requiresAuth);
  },

  delete(url, requiresAuth = true) {
    return this.request("DELETE", url, null, requiresAuth);
  },
};

export default api;


