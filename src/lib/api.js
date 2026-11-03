/**
 * Axios API client configuration.
 * Add base URL, interceptors, and auth headers here.
 */

import axios from "axios";

/**
 * An HTTPS page cannot call an http:// API (mixed content). When that happens,
 * keep the request on this origin and let the host proxy the path to the API.
 * HTTP pages, including local dev, keep the configured URL.
 *
 * @param {string} url
 * @param {{ absolute?: boolean }} [options]
 * @returns {string}
 */
export function browserSafeApiBase(url, { absolute = false } = {}) {
  if (!url) return url;
  if (typeof window === "undefined" || window.location.protocol !== "https:") {
    return url;
  }
  if (!/^http:\/\//i.test(url)) return url;

  try {
    const path = new URL(url).pathname.replace(/\/$/, "");
    return absolute ? `${window.location.origin}${path}` : path;
  } catch {
    return url;
  }
}

const API_BASE_URL = browserSafeApiBase(
  import.meta.env.VITE_API_BASE_URL || "/api"
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error?.response?.data?.errorMessage || error?.response?.data?.message || error.message;
    error.errorMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;
