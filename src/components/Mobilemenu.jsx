import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ isOpen, setMobileMenuVisible }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // body class sync
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("mobile-menu-visible");
    } else {
      document.body.classList.remove("mobile-menu-visible");
      setDropdownOpen(false);
    }
  }, [isOpen]);

  // close helper
  const handleClose = () => {
    setMobileMenuVisible(false);
    document.body.classList.remove("mobile-menu-visible");
    setDropdownOpen(false);
  };

  return (
    <div className={`mobile-menu ${isOpen ? "active" : ""}`} aria-hidden={!isOpen}>
      {/* backdrop */}
      <div className="menu-backdrop" onClick={handleClose}></div>

      {/* menu box */}
      <nav className="menu-box">
        {/* close btn */}
        <button type="button" className="close-btn" onClick={handleClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* logo 
        <div className="nav-logo">
          <Link to="/" onClick={handleClose}>
            <img src="/assets/images/logo-02.png" alt="Logo" />
          </Link>
        </div>*/}

        {/* links */}
        <div className="menu-outer">
          <ul className="navigation">
            <li><Link to="/" onClick={handleClose}>Home</Link></li>
            <li><Link to="/about" onClick={handleClose}>About Us</Link></li>
            <li><Link to="/services" onClick={handleClose}>Our Services</Link></li>

            {/* Dropdown */}
            <li className={`dropdown ${dropdownOpen ? "open" : ""}`}>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Dashboard
              </a>
              <span
                className={`dropdown-btn ${dropdownOpen ? "open" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i class="fas fa-angle-down"></i>
              </span>

              <ul style={{ display: dropdownOpen ? "block" : "none" }}>
                <li><Link to="/donor" onClick={handleClose}>Donor Dashboard</Link></li>
                <li><Link to="/recipient" onClick={handleClose}>Recipient Dashboard</Link></li>
              </ul>
            </li>

            <li><Link to="/contact" onClick={handleClose}>Contact</Link></li>
            <li><Link to="/register" onClick={handleClose}>Register</Link></li>
            <li><Link to="/login" onClick={handleClose}>Login</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
