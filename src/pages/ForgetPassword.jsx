import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful email send
    setEmailSent(true);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h2 className="text-center mb-3">Forgot Your Password?</h2>
            <p className="text-center">
              No worries! Enter your registered email and we’ll send you a secure reset link.
            </p>

            {/* Forgot Password Form */}
            <form id="forgotPasswordForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Registered Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button type="submit" className="primary_btn py-2">
                  Send Reset Link
                </button>
              </div>

              {/* Success Message */}
              {emailSent && (
                <div className="alert alert-success" role="alert">
                  A password reset link has been sent to your email. Please check your inbox or spam folder.
                </div>
              )}

              <p className="text-center mt-3">
                <Link to="/login" className="primary_btn py-2">
                  ← Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
