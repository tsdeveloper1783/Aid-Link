import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService"; // ✅ backend integration

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // ✅ Inform backend to invalidate token (Django REST Framework)
        await logoutUser();

        // ✅ Clear all local storage items
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        // Optional: Clear everything for max security
        // localStorage.clear();

        alert("You have been logged out successfully.");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        // ✅ Redirect user to login page
        navigate("/login");
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <h3>Logging out...</h3>
    </div>
  );
};

export default Logout;
