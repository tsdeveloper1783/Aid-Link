import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Partner from "../components/Partners";
import Servicesection from "../components/Servicesection";

const Home = () => {
  useEffect(() => {
    if (window.jQuery && typeof window.jQuery.fn.owlCarousel === "function") {
      window.jQuery(".banner-section-one-carousel").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 7000,
        smartSpeed: 500,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 1,
          },
        },
      });

      // Initialize the 'one-item-carousel' carousel for testimonials
      window.jQuery(".one-item-carousel").owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 7000,
        smartSpeed: 500,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 1,
          },
        },
      });

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
    } else {
      console.warn(
        "jQuery or Owl Carousel not found. Please ensure they are loaded."
      );
    }

    return () => {};
  }, []); // The empty array ensures this effect runs only once after the initial render

  return (
    <>
      <div className="page-wrapper">
        <Header />

        <section className="banner-section-one style-three">
          <div className="banner-section-one-carousel owl-carousel owl-theme">
            <div className="banner-block-one">
              <div
                className="image-layer"
                style={{
                  backgroundImage: "url(assets/images/main-slider/02.jpg)",
                }}
              ></div>
              <div className="theme_container">
                <div className="content-box">
                  <div className="inner-box">
                    <h6 className="banner-slider-sub-title mb-30">
                      <span className="title-sep-left">
                        <img src="assets/images/resource/icon-11.png" alt="" />
                      </span>
                      Welcome to AidLink
                    </h6>
                    <h2 className="banner-slider-title mb-30">
                      <span> A Little Help Can Make </span> <br /> A Big Change
                    </h2>
                    <div className="banner-slider-text">
                      Join hands to spread hope and kindness, creating brighter
                      futures for <br /> families and communities in need around
                      the world.
                    </div>
                    <div>
                      <Link to="/donor" className="primary_btn mt-3">
                        Donate Now <i className="far fa-heart"></i>
                      </Link>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="banner-block-one">
              <div
                className="image-layer"
                style={{
                  backgroundImage: "url(assets/images/main-slider/01.jpg)",
                }}
              ></div>
              <div className="theme_container">
                <div className="content-box">
                  <div className="inner-box">
                    <h6 className="banner-slider-sub-title mb-30">
                      <span className="title-sep-left">
                        <img src="assets/images/resource/icon-11.png" alt="" />
                      </span>
                      Welcome to Aidlink
                    </h6>
                    <h2 className="banner-slider-title mb-30">
                      <span> Stand United To Change </span> <br />
                      Someone’s Future
                    </h2>
                    <div className="banner-slider-text">
                      Together we can bring hope and support, making a lasting
                      difference in <br /> the lives of those who need care,
                      love, and opportunity.
                    </div>
                    <div>
                      <Link to="/donor" className="primary_btn mt-3">
                        Donate Now <i className="far fa-heart"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       <section className="feature-section">
  <div className="theme_container">
    <div className="row">
      <div className="col-lg-3 col-md-6">
        <div className="feature-block">
          <div className="feature-block_icon">
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <h4 className="feature-block_title">
            <a
              href="#service-0"
              className="text-decoration-none text-dark"
            >
              Support Students
            </a>
          </h4>
          <div className="feature-block_text">
            Guide every student <br /> toward bright futures.
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6">
        <div className="feature-block">
          <div className="feature-block_icon">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h4 className="feature-block_title">
            <a
              href="#service-1"
              className="text-decoration-none text-dark"
            >
              Care for Patients
            </a>
          </h4>
          <div className="feature-block_text">
            Extend care and healing <br /> with gentle support.
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6">
        <div className="feature-block">
          <div className="feature-block_icon">
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <h4 className="feature-block_title">
            <a
              href="#service-2"
              className="text-decoration-none text-dark"
            >
              Feed the Hungry
            </a>
          </h4>
          <div className="feature-block_text">
            Bring food and comfort <br /> to every table.
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6">
        <div className="feature-block">
          <div className="feature-block_icon">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h4 className="feature-block_title">
            <a
              href="#service-3"
              className="text-decoration-none text-dark"
            >
              Support Orphans
            </a>
          </h4>
          <div className="feature-block_text">
            Give love and shelter <br /> to orphaned children.
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



        <section className="why-choose-us s-two">
          <div className="theme_container">
            <div className="row align-items-center">
              <div className="col-lg-3 col-md-5">
                <div className="image">
                  <img src="assets/images/about/about-5-3.jpg" alt="" />
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="choose-us-block s-two">
                  <div className="image">
                    <img src="assets/images/about/about-5-2.jpg" alt="" />
                  </div>
                  <div className="content-box">
                    <h4>
                      Smart Matching, <br /> Built On AI-Driven <br />{" "}
                      Connections
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-5">
                <div className="choose-us-block-two style-four">
                  <div className="sub-title mb-20">
                    <span className="title-sep-left">
                      <img src="assets/images/resource/icon-4.png" alt="" />
                    </span>
                    Why Choose Us
                  </div>
                  <h2 className="sec-title mb-20">
                    Raise Your Hand to Help <br /> Save Environment{" "}
                  </h2>
                  <div className="text">
                    Aid-Link uses AI-based matching and verification to connect
                    donors and recipients with trust and transparency. Every
                    cause is reviewed carefully, ensuring fairness and real
                    impact. With innovation, we protect nature, support
                    communities, and bring hope. Together, our compassion
                    becomes action, making the world safer and greener for
                    future generations.
                  </div>
                  <ul>
                    <li>
                      <i className="fas fa-check"></i>We Support Students
                    </li>
                    <li>
                      <i className="fas fa-check"></i>We Support & Care for
                      Patients
                    </li>
                    <li>
                      <i className="fas fa-check"></i>We Support & Feed the
                      Hungry
                    </li>
                    <li>
                      <i className="fas fa-check"></i>We Support Orphans
                    </li>
                  </ul>
                  <div>
                    <Link to="/services" className="primary_btn">
                      Learn More <i className="far fa-heart"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="donar">
      <div className="theme_container">
        <div className="row no-gutters">
          <div className="col-lg-6">
            <div className="donar-block">
              <div className="sub-title mb-20 s-two text-white">Make Donate</div>
              <h2 className="sec-title s-two mb-4">Become a Donor</h2>
              <div className="bottom">
                <p className="text text-white">
                  Join us in making a meaningful difference. Your support empowers
  communities, brings hope to those in need, and creates lasting
  positive change. Every contribution, big or small, helps us build a
  brighter and more compassionate future for individuals and families
  who rely on our aid.
                </p>
              
                <div>
                  <Link to="/donor" className="primary_btn-two mt-4">
                    Donate <i className="far fa-heart"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="image">
              <img
                src="assets/images/about/main-slider-3.jpg"
                alt="donation"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

        <Servicesection />

        <section className="testimonial-section-three">
          <div className="theme_container">
            <div className="row">
              <div className="col-xl-6">
                <div className="inner-container">
                  <div className="sub-title mb-20">
                    <span className="title-sep-left">
                      <img src="assets/images/resource/icon-9.png" alt="" />
                    </span>
                    Our Testimonials
                  </div>
                  <h2 className="sec-title mb-40 text-dark">
                    <span className="text-dark"> What People Say About</span>
                    <br />
                    Our Organization
                  </h2>
                  <div className="one-item-carousel owl-theme owl-carousel">
                    <div className="testimonial-block-three">
                      <div className="icon">
                        <i className="flaticon-quote"></i>
                      </div>
                      <div className="author-thumb">
                        <img src="assets/images/about/person-1.jpg" alt="" />
                      </div>
                      <div className="text text-black-50">
                        Supporting AidLink was a fantastic experience. They
                        guided me clearly through the donation process and
                        ensured my contribution was used effectively. I really
                        appreciate their transparency and dedication.
                      </div>
                      <div className="author-info">
                        <div className="author-content">
                          <div className="name text-black-50">
                            David S. Neuman
                          </div>
                          <div className="designation text-black-50">
                            Business Manager
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="testimonial-block-three">
                      <div className="icon">
                        <i className="flaticon-quote"></i>
                      </div>
                      <div className="author-thumb">
                        <img src="assets/images/about/person-2.png" alt="" />
                      </div>
                      <div className="text text-black-50">
                        Generous, compassionate, and very trustworthy! They made
                        the donation process smooth and even suggested ways my
                        contribution could have the most impact. I would
                        recommend supporting AidLink through their platform.
                      </div>
                      <div className="author-info">
                        <div className="author-content">
                          <div className="name text-black-50">
                            Michael Roberts
                          </div>
                          <div className="designation text-black-50">
                            Startup Founder
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="image">
                  <img src="assets/images/about/testimonial.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="event-section s-two">
          <div className="theme_container">
            <div className="title-box text-center ">
              <div className="sub-title mb-20">
                <span className="title-sep-left">
                  <img src="assets/images/resource/icon-9.png" alt="" />
                </span>
                Event & Program
                <span className="title-sep-right">
                  <img src="assets/images/resource/icon-9.png" alt="" />
                </span>
              </div>
              <h2 className="sec-title mb-56">
                {" "}
                <span> Our Most Trusted Causes For</span> <br /> Aid-Link
                Support
              </h2>
            </div>
            <div className="row">
              <div
                className="col-lg-12 wow fadeInUp"
                data-wow-delay="0ms"
                data-wow-duration="1500ms"
              >
                <div className="events-block-one">
                  <div className="inner">
                    <div
                      className="layer-outer"
                      style={{
                        backgroundImage:
                          "url(assets/images/about/bg-about.jpg)",
                      }}
                    ></div>
                    <div className="left">
                      <div className="date-box">
                        <div className="inner-text">
                          <h2>Jan</h2>
                          <p>05</p>
                        </div>
                      </div>

                      <div className="middle-text">
                        <h5>System Launch Demo</h5>
                        <h2>
                          <a href="">
                            Official Introduction to Aid-Link Verification
                            Platform
                          </a>{" "}
                        </h2>
                        <p>
                          Experience how AI builds secure and trusted donation
                          networks.
                        </p>
                      </div>
                    </div>
                    <div className="button-three">
                      <Link to="/events#events" className="primary_btn style-five">
                        View Events <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-12 wow fadeInUp"
                data-wow-delay="0ms"
                data-wow-duration="1500ms"
              >
                <div className="events-block-one">
                  <div className="inner">
                    <div
                      className="layer-outer"
                      style={{
                        backgroundImage:
                          "url(assets/images/about/bg-about.jpg)",
                      }}
                    ></div>
                    <div className="left">
                      <div className="date-box">
                        <div className="inner-text">
                          <h2>Feb</h2>
                          <p>23</p>
                        </div>
                      </div>
                      <div className="middle-text">
                        <h5>AI Workshop</h5>
                        <h2>
                          <a href="event-details.html">
                            Recipient Verification without Databases 2025
                          </a>{" "}
                        </h2>
                        <p>
                          Learn how Aid-Link validates documents and checks
                          social proof.
                        </p>
                      </div>
                    </div>
                    <div className="button-three">
                      <Link to="/events#events" className="primary_btn style-five">
                        View Events <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-12 wow fadeInUp"
                data-wow-delay="0ms"
                data-wow-duration="1500ms"
              >
                <div className="events-block-one">
                  <div className="inner">
                    <div
                      className="layer-outer"
                      style={{
                        backgroundImage:
                          "url(assets/images/about/bg-about.jpg)",
                      }}
                    ></div>
                    <div className="left">
                      <div className="date-box">
                        <div className="inner-text">
                          <h2>Mar</h2>
                          <p>27</p>
                        </div>
                      </div>

                      <div className="middle-text">
                        <h5>Transparency Meet</h5>
                        <h2>
                          <a href="event-details.html">
                            Building Trust Between Donors and Recipients 2025
                          </a>{" "}
                        </h2>
                        <p>
                          Explore how NGOs ensure accountability with verified
                          requests.
                        </p>
                      </div>
                    </div>
                    <div className="button-three">
                      <Link to="/events#events" className="primary_btn style-five">
                        View Events <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-box text-center mt-4">
              <div className="button-three">
                <Link to="/Learnmore#learnmore" className="primary_btn style-three">
                  Learn More Us<i className="far fa-heart"></i>
                </Link>
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

export default Home;
