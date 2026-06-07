import axios from "axios";
import { io } from "socket.io-client";

// ===========================================
// BASE URL
// ===========================================
const BASE_URL = "https://neofeed-backend.onrender.com";

// ===========================================
// AXIOS INSTANCE
// ===========================================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===========================================
// ATTACH JWT TOKEN TO EVERY REQUEST
// ===========================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===========================================
// AUTO LOGOUT ON 401
// ===========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("neonateId");
      localStorage.removeItem("username");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ===========================================
// SOCKET.IO CONNECTION
// ===========================================
export const socket = io(BASE_URL, {
  transports: ["polling", "websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ Connected to NeoFEED Socket Server");
  console.log("Socket ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from NeoFEED Socket Server");
});

socket.on("connect_error", (error) => {
  console.log("🚨 Socket Connection Error:", error);
});

// ===========================================
// TOKEN HELPERS
// ===========================================
export const saveAuth = (token, role, neonateId, username) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("neonateId", neonateId || "");
  localStorage.setItem("username", username || "");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("neonateId");
  localStorage.removeItem("username");
};

export const getRole = () => localStorage.getItem("role");
export const getNeonateId = () => localStorage.getItem("neonateId");
export const getToken = () => localStorage.getItem("token");
export const isLoggedIn = () => !!localStorage.getItem("token");

// ===========================================
// LOGIN API
// ===========================================
export const loginUser = async (userId, password) => {
  const response = await api.post("/api/login", { userId, password });
  const data = response.data;

  if (data.success) {
    saveAuth(data.token, data.role, data.neonateId, data.username);
  }

  return data;
};

// ===========================================
// REGISTER API
// ===========================================
export const registerUser = async (payload) => {
  const response = await api.post("/api/register", payload);
  return response.data;
};

// ===========================================
// CURRENT USER
// ===========================================
export const fetchMe = async () => {
  const response = await api.get("/api/me");
  return response.data;
};

// ===========================================
// FETCH FULL NEONATE DATA
// ===========================================
export const fetchNeonateData = async (neonateId) => {
  const response = await api.get(`/api/data/${neonateId}`);
  return response.data;
};

// ===========================================
// FETCH SINGLE STREAM ROW
// ===========================================
export const fetchStreamRow = async (index) => {
  const response = await api.get(`/api/stream/${index}`);
  return response.data;
};

// ===========================================
// MANUAL ML PREDICTION API
// ===========================================
export const predictReadiness = async (payload) => {
  const response = await api.post("/api/predict", payload);
  return response.data;
};

// ===========================================
// PROCESS DATASET API
// ===========================================
export const processDataset = async () => {
  const response = await api.get("/api/process-dataset");
  return response.data;
};

// ===========================================
// EXPORTS
// ===========================================
export default api;
