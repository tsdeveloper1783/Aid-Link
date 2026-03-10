import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Servicesection from "../components/Servicesection";
import Partner from "../components/Partners";
import Footer from "../components/Footer";


const About = () => {
  useEffect(() => {
    // Initialize the 'five-item-carousel' for partners
    window.jQuery(".five-item-carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 7000,
      smartSpeed: 500,
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 2,
        },
        768: {
          items: 3,
        },
        992: {
          items: 4,
        },
        1200: {
          items: 5,
        },
      },
    });
  });

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <section
          className="page-title"
          style={{ backgroundImage: "url(assets/images/about/about-bg.jpg)" }}
        >
          <div className="theme_container">
            <div className="content-box">
              <div className="shape">
                <img src="assets/images/resource/star-icon-2.png" alt="" />
              </div>
              <div className="shape-two">
                <img src="assets/images/resource/page-title-1.png" alt="" />
              </div>
              <div className="shape-three">
                <img src="assets/images/resource/icon-3.png" alt="" />
              </div>
              <div className="content-wrapper">
                <div className="title">
                  <h1>About Us</h1>
                </div>
                <ul className="bread-crumb">
                  <li>
                    <a href="index-3.html">Home</a>
                  </li>
                  <li>About Us</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section-three">
          <div className="theme_container">
            <div className="row no-gutters">
              <div className="col-lg-3 col-md-6">
                <div className="about-three-blcok">
                  <div className="image d-none d-md-block">
                    <img src="assets/images/resource/icon-3-1.png" alt="" />
                  </div>
                  <div className="image-two d-none d-md-block">
                    <img src="assets/images/about/001.jpg" alt="" />
                  </div>
                  <div className="image-three d-none d-md-block">
                    <img src="assets/images/about/03.jpg" alt="" />
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="about-block-four">
                  <div className="big-title d-none d-md-block">About Us</div>
                  <div className="image d-none d-md-block">
                    <img src="assets/images/about/04.jpg" alt="" />
                  </div>
                  <div className="image d-none d-md-block">
                    <img src="assets/images/about/002.jpg" alt="" />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12">
                <div className="choose-us-block-two style-five">
                  <div className="sub-title mb-20">
                    <span className="title-sep-left">
                      <img src="assets/images/resource/icon-9.png" alt="" />
                    </span>
                    Why Choose Us
                  </div>
                  <h2 className="sec-title mb-20">
                    <span>Rise Your Hand to Save</span> <br /> Innocent Souls
                    Today
                  </h2>
                  <div className="mission-block s-two">
                    <div className="tab-btn">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            data-bs-toggle="tab"
                            data-bs-target="#tab-1"
                            type="button"
                            role="tab"
                            aria-controls="tab-1"
                            aria-selected="true"
                          >
                            <span>Our Mission</span>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            data-bs-toggle="tab"
                            data-bs-target="#tab-2"
                            type="button"
                            role="tab"
                            aria-controls="tab-2"
                            aria-selected="false"
                          >
                            <span>Our Vision</span>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            data-bs-toggle="tab"
                            data-bs-target="#tab-3"
                            type="button"
                            role="tab"
                            aria-controls="tab-3"
                            aria-selected="false"
                          >
                            <span>Next Plan</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="tab-1"
                      role="tabpanel"
                      aria-labelledby="tab-1"
                    >
                      <div className="text">
                        {" "}
                        We believe in spreading kindness and support, helping
                        students in education, caring for patients, feeding the
                        hungry, and giving love and shelter to orphans for a
                        brighter tomorrow.{" "}
                      </div>
                      <div className="tab-icon">
                        <ul>
                          <li>
                            <i className="fas fa-check"></i>We Support Students
                          </li>
                          <li>
                            <i className="fas fa-check"></i>We Support & Care
                            for Patients
                          </li>
                          <li>
                            <i className="fas fa-check"></i>We Support & Feed
                            the Hungry
                          </li>
                          <li>
                            <i className="fas fa-check"></i>We Support Orphans
                          </li>
                        </ul>
                      </div>
                      <div className="link-btn">
                        <Link to="/services" className="primary_btn-one">
                          Learn More<i className="far fa-heart"></i>
                        </Link>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-2"
                      role="tabpanel"
                      aria-labelledby="tab-2"
                    >
                      <div className="text">
                        We work with passion and sincerity, empowering students
                        through education, supporting patients with care,
                        feeding the hungry with dignity, and providing orphans
                        with love, shelter, and hope.{" "}
                      </div>
                      <div className="tab-icon">
                        <ul>
                          <li>
                            <i className="fas fa-check"></i>Educating Students
                            with Knowledge
                          </li>
                          <li>
                            <i className="fas fa-check"></i>Caring for Patients
                            with Compassion
                          </li>
                          <li>
                            <i className="fas fa-check"></i>Feeding the Hungry
                            with Dignity
                          </li>
                          <li>
                            <i className="fas fa-check"></i>Giving Orphans Love
                            & Shelter
                          </li>
                        </ul>
                      </div>
                      <div className="link-btn">
                        <Link to="/services" className="primary_btn-one">
                          Learn More<i className="far fa-heart"></i>
                        </Link>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="tab-3"
                      role="tabpanel"
                      aria-labelledby="tab-3"
                    >
                      <div className="text">
                        We aim to expand quality education, improve healthcare
                        services, increase food aid, and provide secure housing
                        for orphans, building a stronger impact ahead.{" "}
                      </div>
                      <div className="tab-icon">
                        <ul>
                          <li>
                            <i className="fas fa-check"></i>Expand Student
                            Support Programs
                          </li>
                          <li>
                            <i className="fas fa-check"></i>Enhance Patient Care
                            Services
                          </li>
                          <li>
                            <i className="fas fa-check"></i>Increase Food Aid
                            Projects
                          </li>
                          <li>
                            <i className="fas fa-check"></i>Build Homes for
                            Orphans
                          </li>
                        </ul>
                      </div>
                      <div className="link-btn">
                        <Link to="/services" className="primary_btn-one">
                          Learn More<i className="far fa-heart"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="what-we-do-section">
          <div
            className="bg"
            style={{
              backgroundImage: "url('assets/images/resource/service-map.png')",
            }}
          ></div>

          <div className="theme_container">
            <div className="title-box">
              <div className="sub-title mb-20">
                <span className="title-sep-left">
                  <img src="assets/images/resource/icon-4.png" alt="" />
                </span>
                What We Do
              </div>
              <h2 className="sec-title">
                We Work Differently to <br /> keep The World Safe{" "}
              </h2>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div
                  className="what-we-do-block"
                  style={{
                    backgroundImage:
                      "url('assets/images/about/what we do.jpg')",
                  }}
                >
                  <div className="icon-box">
                    <i className="flaticon-fruit"></i>
                  </div>
                  <h4>Pure Food & Water</h4>
                  <div className="text">
                    Providing clean food daily <br />
                    and safe drinking water
                  </div>
                  <Link to="/learnmore" className="button">
                    Read More<i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div
                  className="what-we-do-block"
                  style={{
                    backgroundImage:
                      "url('assets/images/about/what we do.jpg')",
                  }}
                >
                  <div className="icon-box s-two">
                    <i className="flaticon-medicine"></i>
                  </div>
                  <h4>Health & Medicine</h4>
                  <div className="text">
                    Quality health support and <br />
                    trusted medicine
                  </div>
                  <Link to="/learnmore" className="button">
                    Read More<i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div
                  className="what-we-do-block"
                  style={{
                    backgroundImage:
                      "url('assets/images/about/what we do.jpg')",
                  }}
                >
                  <div className="icon-box style-three">
                    <i className="flaticon-education"></i>
                  </div>
                  <h4>Child Education</h4>
                  <div className="text">
                    Better future through <br />
                    knowledge and learning
                  </div>
                  <Link to="/learnmore" className="button">
                    Read More<i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div
                  className="what-we-do-block"
                  style={{
                    backgroundImage:
                      "url('assets/images/about/what we do.jpg')",
                  }}
                >
                  <div className="icon-box style-four">
                    <i className="flaticon-house"></i>
                  </div>
                  <h4>Charity For Live</h4>
                  <div className="text">
                    Support with kindness <br />
                    bringing hope always
                  </div>
                  <Link to="/learnmore" className="button">
                    Read More<i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <Servicesection />

        <section className="volunteer-section">
          <div className="theme_container">
            <div className="row">
              <div className="col-lg-6">
                <div className="volunteer-block">
                  <div className="shape">
                    <img src="assets/images/resource/icon-2.png" alt="" />
                  </div>
                  <img src="assets/images/about/voluntee.jpg" alt="" />
                  <div className="icon">
                    <img src="assets/images/resource/icon.png" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="shape-two">
                  <img src="assets/images/resource/icon-3.png" alt="" />
                </div>
                <div className="volunteer-block-two">
                  <div className="title-box">
                    <div className="sub-title mb-20">
                      <span className="title-sep-left">
                        <img src="assets/images/resource/icon-4.png" alt="" />
                      </span>
                      Become a Volunteer
                    </div>
                    <h2 className="sec-title mb-20">
                      Are You Ready to Join <br /> Our Team Member ?{" "}
                    </h2>
                  </div>
                  <div className="text">
                    At Aid-Link, volunteering means standing beside those who
                    need us most. Our volunteers are the heart of our mission,
                    spreading kindness where it matters most. Join Aid-Link
                    today — your time and efforts can change countless lives.
                  </div>
                  <div className="link-btn">
                    <a href="#" className="primary_btn-one">
                      Become a Volunteer<i className="far fa-heart"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Partner />
        <Footer />
      </div>

      <a
        href="# "
        className="back-to-top "
        data-wow-duration="1.0s "
        data-wow-delay="1.0s "
      >
        <i className="fas fa-angle-up "></i>
      </a>
    </>
  );
};

export default About;
