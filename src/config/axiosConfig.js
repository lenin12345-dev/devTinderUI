import axios from "axios";
import { API_BASE_URL } from "./api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This includes cookies automatically
});

export default axiosInstance;
