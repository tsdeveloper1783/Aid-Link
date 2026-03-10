import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/"; // Base URL for all endpoints

// ===================== Authentication ===================== //

// Register new user (donor or recipient)
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}users/register/`, userData);
};

// Login (get JWT tokens)
export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}users/token/`, credentials);
};

// Refresh JWT token
export const refreshToken = async (refreshToken) => {
  return await axios.post(`${API_URL}users/token/refresh/`, { refresh: refreshToken });
};

// ===================== User Profile ===================== //

// Get current logged-in user info
export const getCurrentUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  return await axios.get(`${API_URL}users/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update user profile
export const updateUser = async (userId, updatedData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  return await axios.put(`${API_URL}users/${userId}/`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get dashboard data based on user role
export const getDashboardData = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  return await axios.get(`${API_URL}users/dashboard/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ===================== Donations ===================== //

// Make a donation (Donor)
export const createDonation = async (donationData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  return await axios.post(`${API_URL}donations/`, donationData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get donations made by user
export const getUserDonations = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  return await axios.get(`${API_URL}donations/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ===================== Contact / Feedback ===================== //

// Send message via Contact page
export const sendContactMessage = async (messageData) => {
  return await axios.post(`${API_URL}contact/`, messageData);
};

// ===================== Forgot / Reset Password ===================== //

// Request password reset email
export const requestPasswordReset = async (email) => {
  return await axios.post(`${API_URL}users/forgot-password/`, { email });
};

// Reset password using token from email
export const resetPassword = async (resetData) => {
  return await axios.post(`${API_URL}users/reset-password/`, resetData);
};
