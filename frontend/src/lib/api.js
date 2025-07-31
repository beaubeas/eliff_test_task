import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => {
    const config =
      userData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.post("/register", userData, config);
  },
  login: (credentials) => api.post("/login", credentials),
};

// Case API
export const caseAPI = {
  register: (caseData) => {
    const config =
      caseData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.post("/case/register", caseData, config);
  },
  fetchAll: () => api.get("/cases/all"),
  fetchByUserId: (userId) => api.post("/cases/user", { userId }),
  updateVerificationStatus: (id, verified) =>
    api.post("/case/update/verified", { id, verified }),
  updateOppositeStatus: (id, oppositeStatus) =>
    api.post("/case/update/opposite", { id, oppositeStatus }),
  updateCaseStatus: (id, caseStatus) =>
    api.post("/case/update/status", { id, caseStatus }),
};

export default api;
