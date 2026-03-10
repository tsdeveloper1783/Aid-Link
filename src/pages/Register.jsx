import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role before registering.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const registerData = new FormData();
      registerData.append("username", formData.fullName);
      registerData.append("email", formData.email);
      registerData.append("password", formData.password);
      registerData.append("phone", formData.phone);
      registerData.append("address", formData.address);
      registerData.append("role", role);
      if (formData.profilePicture) {
        registerData.append("profile_picture", formData.profilePicture);
      }

      // ✅ FIXED LINE: Removed leading slash so Axios uses baseURL correctly
      const res = await axiosInstance.post("api/register/", registerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const userData = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: userData.access || userData.token,
          refreshToken: userData.refresh || userData.refresh_token,
          role: userData.role,
        })
      );

      if (userData.role === "donor") {
        navigate("/Donor");
      } else if (userData.role === "recipient") {
        navigate("/Recipient");
      } else {
        navigate("/login");
      }

      alert("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ overflowX: "hidden" }}>
      <div className="container-fluid d-flex flex-column min-vh-100 overflow-hidden">
        <div className="row flex-grow-1 gx-0">
          <div
            className="col-12 col-md-4 text-white d-flex align-items-center justify-content-center flex-column text-center py-5"
            style={{ backgroundColor: "#90be54" }}
          >
            <h2 className="fw-bold mb-3 text-white">Already Registered?</h2>
            <p className="mb-4">Login now and access your dashboard.</p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/" className="primary_btn-two small py-2">
                Home
              </Link>
              <Link to="/login" className="primary_btn-two small py-2">
                Login
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-8 d-flex align-items-center justify-content-center p-5">
            <div className="w-100 mx-auto" style={{ maxWidth: "700px" }}>
              <h2 className="text-center mb-2">Create Your Account</h2>
              <p className="text-center text-muted">
                Join AidLink as a Donor or Recipient
              </p>

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="+92XXXXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address / City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="City, Street, Area"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Select Role</label>
                    <select
                      className="form-select"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      <option value="donor">Donor</option>
                      <option value="recipient">Recipient</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Upload Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 mt-2">
                    <div className="form-check custom-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to{" "}
                        <Link
                          to="/terms"
                          className="text-success text-decoration-none"
                        >
                          AidLink's Terms & Conditions
                        </Link>
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="primary_btn mt-3 py-2"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}{" "}
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-check .form-check-input:checked {
          background-color: #90be54 !important;
          border-color: #90be54 !important;
        }
      `}</style>
    </div>
  );
};

export default Register;
