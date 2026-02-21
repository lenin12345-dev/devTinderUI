import axios from "axios";
import { API_BASE_URL } from "./api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // if access token expired
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/refresh");

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);
        window.location.href = "/auth"; // real logout
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
