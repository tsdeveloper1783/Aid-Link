import axios from "axios";

// Django backend API ka base URL
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Har request ke sath JWT token attach karna
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================== AUTH ==================

// Register
export const registerUser = (userData) => API.post("register/", userData);

// Login -> tokens milenge
export const loginUser = (credentials) => API.post("token/", credentials);

// Refresh token
export const refreshToken = (refresh) => API.post("token/refresh/", { refresh });

// Forgot password
export const forgotPassword = (data) => API.post("forgot-password/", data);

// ================== USERS ==================

// Get current user profile
export const getProfile = () => API.get("profile/");

// ================== CONTACT ==================

// Send contact form message
export const sendContactMessage = (messageData) => API.post("contact/", messageData);

// ================== DONATIONS ==================

// Get all donations
export const getDonations = () => API.get("donations/");

// Create donation
export const createDonation = (donationData) => API.post("donations/create/", donationData);

// ================== RECIPIENT REQUESTS ==================

// Get all requests
export const getRequests = () => API.get("requests/");

// Create new request
export const createRequest = (requestData) => API.post("requests/create/", requestData);
