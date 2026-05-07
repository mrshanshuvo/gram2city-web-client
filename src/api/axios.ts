import axios from "axios";
import { useAuthStore } from "../features/auth/authStore";

const baseURL = import.meta.env.VITE_API_URL;

export const axiosPublic = axios.create({
  baseURL,
  timeout: 30000,
});

export const axiosSecure = axios.create({
  baseURL,
  timeout: 30000,
});

// Request Interceptor: Inject Token
axiosSecure.interceptors.request.use(
  async (config) => {
    const { user } = useAuthStore.getState();
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("AxiosSecure: Failed to get token", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Public: Basic Error Logging
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error: Please check your connection.");
    }
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const { logout } = useAuthStore.getState();

    if (status === 401) {
      console.warn("Unauthorized access - logging out");
      await logout();
      // Use window.location for forced redirect to avoid circular dependencies with router
      window.location.href = "/login";
    } else if (status === 403) {
      window.location.href = "/forbidden";
    }

    return Promise.reject(error);
  }
);
