import axios from "axios";
import { API_BASE_URL } from "./api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This includes cookies automatically
});

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // Success path
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.error("Unauthorized: clearing user and redirecting to login");
      // Clear user from localStorage
      localStorage.removeItem("user");
      // Redirect to login page
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
