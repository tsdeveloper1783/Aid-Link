import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileMenu from "./Mobilemenu";

const Header = () => {
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);

  useEffect(() => {
    if (isMobileMenuVisible) {
      document.body.classList.add("mobile-menu-visible");
    } else {
      document.body.classList.remove("mobile-menu-visible");
    }
  }, [isMobileMenuVisible]);

  return (
    <header className="main-header header-style-four">
      <div className="header-upper">
        <div className="header-container-box">
          <div className="inner-container">
            <div className="left-column">
              <div className="logo">
                <Link to="/">
                  <img src="public/assets/images/logo-02.png" alt="Logo" />
                </Link>
              </div>
            </div>

            <div className="middle-column">
              <div className="nav-outer">
                <div
                  className="mobile-nav-toggler"
                  onClick={() => setMobileMenuVisible(true)}
                >
                  <img src="assets/images/icons/icon-bar.png" alt="Menu" />
                </div>

                <nav className="main-menu navbar-expand-md navbar-light">
                  <div
                    className="collapse navbar-collapse show clearfix"
                    id="navbarSupportedContent"
                  >
                    <ul className="navigation">
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/about">About Us</Link>
                      </li>
                      <li>
                        <Link to="/services">Our Services</Link>
                      </li>
                      <li className="nav-item dropdown">
                        <button
                          className="dropdown-toggle"
                          type="button"
                          id="dashboardDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Dashboard <i className="fas fa-angle-down ms-1"></i>
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dashboardDropdown"
                        >
                          <li>
                            <Link className="dropdown-item" to="/Donor">
                              Donor Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" to="/Recipient">
                              Recipient Dashboard
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link to="/contact">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>

            <div className="right-column gap-2">
              <Link to="/register" className="primary_btn-two small">
                Register
              </Link>
              <Link to="/login" className="primary_btn-two small">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-header">
        <div className="header-upper">
          <div className="header-container-box">
            <div className="inner-container">
              <div className="left-column">
                <div className="logo">
                  <Link to="/">
                    <img src="public/assets/images/logo-02.png" alt="Logo" />
                  </Link>
                </div>
              </div>

              <div className="middle-column">
                <div className="nav-outer">
                  <div
                    className="mobile-nav-toggler"
                    onClick={() => setMobileMenuVisible(true)}
                  >
                    <img src="assets/images/icons/icon-bar.png" alt="Menu" />
                  </div>

                  <nav className="main-menu navbar-expand-md navbar-light">
                    <div
                      className="collapse navbar-collapse show clearfix"
                      id="navbarSticky"
                    >
                      <ul className="navigation">
                        <li>
                          <Link to="/">Home</Link>
                        </li>
                        <li>
                          <Link to="/about">About Us</Link>
                        </li>
                        <li>
                          <Link to="/services">Our Services</Link>
                        </li>
                        <li className="dropdown">
                          <span
                            className="nav-link dropdown-toggle"
                            role="button"
                            id="dashboardDropdownSticky"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Dashboard <i className="fas fa-angle-down ms-1"></i>
                          </span>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dashboardDropdownSticky"
                          >
                            <li>
                              <Link className="dropdown-item" to="/donor">
                                Donor Dashboard
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="/recipient">
                                Recipient Dashboard
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link to="/contact">Contact</Link>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>

              <div className="right-column gap-2">
                <Link to="/register" className="primary_btn-two small">
                  Register
                </Link>
                <Link to="/login" className="primary_btn-two small">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Mobile Menu Start */}
      <MobileMenu/>

      <div className="nav-overlay"></div>
    </header>
  );
};

export default Header;
