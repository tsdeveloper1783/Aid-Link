import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already logged in and redirect if so
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("🔄 Already logged in, redirecting to:", parsedUser.role);
        
        if (parsedUser.role === "donor") {
          navigate("/Donor", { replace: true });
        } else if (parsedUser.role === "recipient") {
          navigate("/Recipient", { replace: true });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.clear();
      }
    }
  }, [navigate]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("api/token/", {
        username: email,
        password,
      });

      const data = res.data;
      console.log("✅ Login success:", data);

      // ✅ CORRECT TOKEN STORAGE - FIXED
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // ✅ Decode JWT to get user info
      let decoded = {};
      try {
        decoded = jwtDecode(data.access);
        console.log("Decoded token:", decoded);
      } catch (err) {
        console.error("Token decode failed:", err);
      }

      // ✅ STORE COMPLETE USER INFO - FIXED
      const userInfo = {
        id: data.user?.id || decoded.user_id,
        username: data.user?.username || decoded.username,
        email: data.user?.email || decoded.email,
        role: data.role || decoded?.role || data.user?.role || 'donor',
        token: data.access // ✅ Add token to user object
      };
      
      localStorage.setItem("user", JSON.stringify(userInfo));
      console.log("💾 User info saved:", userInfo);

      // ✅ Get role and navigate immediately
      const role = userInfo.role;
      console.log("🎯 Navigating to role:", role);
      
      if (role === "donor") {
        alert("Welcome back, Donor!");
        navigate("/Donor", { replace: true });
      } else if (role === "recipient") {
        alert("Welcome back, Recipient!");
        navigate("/Recipient", { replace: true });
      } else {
        alert("Login successful! Defaulting to Donor dashboard.");
        navigate("/Donor", { replace: true });
      }

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid min-vh-100 d-flex flex-column">
        <div className="row flex-grow-1">
          <div className="col-12 col-md-8 d-flex align-items-center justify-content-center py-5">
            <div className="w-100 px-4" style={{ maxWidth: "600px" }}>
              <h2 className="text-center mb-4">Login to AidLink</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your username or email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                  />
                  <div className="form-check mt-2 custom-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onClick={togglePassword}
                      id="showPassword"
                    />
                    <label className="form-check-label" htmlFor="showPassword">
                      Show Password
                    </label>
                  </div>
                </div>

                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="primary_btn py-2"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>

                <p className="text-center">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-success">
                    Sign up here
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <div
            className="col-12 col-md-4 text-white d-flex align-items-center justify-content-center flex-column text-center py-5"
            style={{ backgroundColor: "#90be54" }}
          >
            <h2 className="fw-bold mb-3 text-white">New Here?</h2>
            <p className="mb-4">Sign up and discover new opportunities!</p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/" className="primary_btn-two small py-2">
                Home
              </Link>
              <Link to="/register" className="primary_btn-two small py-2">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;