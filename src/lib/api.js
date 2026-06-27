import axios from "axios";
import { clearAuth, getAuth } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";


// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =======================
   Request Interceptor
======================= */
api.interceptors.request.use(
  (config) => {
    const auth = getAuth();
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* =======================
   Response Interceptor
======================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
    }
    return Promise.reject(error);
  },
);
