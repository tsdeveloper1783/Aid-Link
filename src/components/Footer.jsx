import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="main-footer style-three">
        <div className="main-footer-top">
          <div className="theme_container">
            <div className="widgets-section">
              <div className="row clearfix">
                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget-item">
                    <div className="title">
                      <h2>Contact</h2>
                    </div>
                    <div className="icon-list">
                      <ul>
                        <li>
                          <div className="icon">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          <div className="text">University of Mianwali</div>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="fa-regular fa-envelope"></i>
                          </div>
                          <div className="text">
                            <a href="mailto:hotline@gmail.com">
                              support@aidlink.com
                            </a>
                          </div>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="fa-solid fa-phone-volume"></i>
                          </div>
                          <div className="text">
                            <a href="tel:+012(345)6789">+92 3075219 319</a>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="donate.html"
                      className="primary_btn style-thirteen mt-5"
                    >
                      Donation <i className="far fa-heart"></i>
                    </a>
                  </div>
                </div>

                <div
                  className="col-xl-3 col-md-6 wow animated fadeInUp"
                  data-wow-delay="0.3s"
                >
                  <div className="footer-widget">
                    <div className="title">
                      <h2>Causes</h2>
                    </div>
                    <div className="icon-list">
                      <ul>
  <li>
    <a href="/learnmore">
      <i className="fa-solid fa-arrow-right icon-green"></i>
      Smart Matching
    </a>
  </li>
  <li>
    <a href="/learnmore">
      <i className="fa-solid fa-arrow-right icon-green"></i>
      Fraud Detection
    </a>
  </li>
  <li>
    <a href="/learnmore">
      <i className="fa-solid fa-arrow-right icon-green"></i>
      Secure Payments
    </a>
  </li>
  <li>
    <a href="/learnmore">
     <i className="fa-solid fa-arrow-right icon-green"></i>
      Real-Time Tracking
    </a>
  </li>
  <li>
    <a href="/learnmore">
     <i className="fa-solid fa-arrow-right icon-green"></i>
      Verified Recipients
    </a>
  </li>
  <li>
    <a href="/learnmore">
      <i className="fa-solid fa-arrow-right icon-green"></i>
      AI Powered Matching
    </a>
  </li>
</ul>
                    </div>
                  </div>
                </div>

<div className="col-xl-3 col-md-6">
  <div className="footer-widget-item mar-t50 s-two">
    <div className="title">
      <h2>Recent News</h2>
    </div>

    <div className="footer-widget-news">
      <ul>
        <li>
          <div className="img-box">
            <Link to="/blog-details">
              <img src="assets/images/about/event.jpg" alt="Event" />
            </Link>
          </div>

          <div className="text-box">
            <p>
              <span className="far fa-calendar-alt"></span>
              <Link to="/newsletterpage">20th June 2024</Link>
            </p>
          </div>
        </li>

        <li>
          <div className="img-box">
            <Link to="/blog-details">
              <img src="assets/images/about/event.jpg" alt="Event" />
            </Link>
          </div>

          <div className="text-box">
            <p>
              <span className="far fa-calendar-alt"></span>
              <Link to="/newsletterpage">24th January 2025</Link>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>

                <div className="col-xl-3 col-md-6">
                  <div className="footer-widget-item-2 mar-l13">
                    <div className="title">
                      <h2>Newsletter</h2>
                    </div>

                    <div className="footer-widget-newsletter">
                      <p>
                        Subscribe our newsletter to get our <br /> latest
                        updates & news.
                      </p>
                      <div className="subscribe-box">
                        <form className="subscribe-form" action="#">
                          <div className="input-box">
                            <input
                              type="email"
                              name="email"
                              placeholder="Enter Email"
                            />
                            <button type="submit">
                              <i className="fa-solid fa-arrow-right"></i>
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="social-link">
                        <ul>
                          <li>
                            <a href="#" aria-label="Facebook">
                              <i className="fab fa-facebook-f"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#" aria-label="Twitter">
                              <i className="fab fa-twitter"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#" aria-label="YouTube">
                              <i className="fab fa-youtube"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#" aria-label="LinkedIn">
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-footer-bottom">
          <div className="theme_container">
            <div className="main-footer-bottom-inner">
              <ul>
                <li>
                  <Link to="/privacy">Privacy & Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms & Conditions</Link>
                </li>
              </ul>
              <div className="text">
                <p>Copyright © 2025 AidLink. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
