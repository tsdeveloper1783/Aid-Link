import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: API_BASE, // ❗ no /api here
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/* =========================
   PUBLIC (NO-TOKEN) ROUTES
========================= */
const PUBLIC_ENDPOINTS = [
  "/api/register/",
  "/api/token/",
  "/api/token/refresh/",
  "/api/forgot-password/",
  "/api/reset-password/",
];

/* =========================
   REQUEST INTERCEPTOR
========================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    // ✅ Attach token ONLY for protected routes
    if (
      token &&
      !PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Handle FormData correctly
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject({
        ...error,
        message: "Network or server error",
      });
    }

    // ❌ Never try refresh on public routes
    if (
      PUBLIC_ENDPOINTS.some((url) =>
        originalRequest.url?.includes(url)
      )
    ) {
      return Promise.reject(error);
    }

    // 🔁 Token refresh logic
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${API_BASE}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = res.data.access;
        localStorage.setItem("access_token", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
