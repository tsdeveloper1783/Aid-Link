// src/services/authService.js
import axiosInstance from "../utils/axiosInstance";

/**
 * 🔐 Register User (Signup)
 * Sends form data + role (Donor / Recipient) to Django backend
 */
export const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/register/", formData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔑 Login User
 * Authenticates with Django backend and stores JWT tokens & user info
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/login/", credentials);

    // ✅ Store tokens + user info locally
    const { access, refresh, user } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🚪 Logout User
 * Invalidates refresh token on Django side (token blacklisting)
 */
export const logoutUser = async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      await axiosInstance.post("/api/logout/", { refresh });
    }

    // ✅ Clean up locally
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    return true;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🧠 Get current logged-in user
 * Safely retrieves user info from localStorage
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * 🛠 Refresh Access Token
 * (Optional: automatically called when access token expires)
 */
export const refreshAccessToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return;

    const response = await axiosInstance.post("/api/token/refresh/", {
      refresh,
    });

    localStorage.setItem("access", response.data.access);
  } catch (error) {
    console.error("Token refresh failed:", error.response?.data || error.message);
    throw error;
  }
};
