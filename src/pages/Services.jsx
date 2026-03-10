import { useEffect } from "react"; // Import useEffect
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import CauseCard from "../components/CauseCard";
import Header from "../components/Header";
import Partner from "../components/Partners";

const Services = () => {
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

  // Custom cause cards data
  const causeCards = [
    {
      image: "charity.jpg",
      heading: "Education",
      title: "Raise Hand To The Poor Children Education For Better Future",
      raised: 256,
    },
    {
      image: "charity-2.avif",
      heading: "Medical",
      title: "Help The Needy People For Medical & Medicines Support",
      raised: 562,
    },
    {
      image: "charity-2.jpg",
      heading: "Food",
      title: "Feed Hungry Families In Rural Areas",
      raised: 1200,
    },
    {
      image: "charity-4.jpg",
      heading: "Shelter",
      title: "Rebuild Homes For Flood Affected Families",
      raised: 1200,
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <Header />

        <section
          className="page-title"
          style={{ backgroundImage: "url(assets/images/service.jpg)" }}
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
                  <h1>Our Services</h1>
                </div>
                <ul className="bread-crumb">
                  <li>
                    <a href="index-3.html">Home</a>
                  </li>
                  <li>Our Services</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="bg"></div>
          <div className="theme_container">
            <div className="row">
              <div className="col-lg-6">
                <div className="features-block">
                  <div className="icon-box">
                    <i class="fa-solid fa-check-double"></i>
                  </div>
                  <div className="content">
                    <h4>AI Verification</h4>
                    <div className="text">
                      Verify recipients fast and secure with AI checks, reducing mistakes and building trust.
                    </div>
                    <Link to="/learnmore#features" className="button">
                      Read More<i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
             
              <div className="col-lg-6">
                <div className="features-block">
                  <div className="icon-box style-three">
                    <i class="bi bi-lightning-charge-fill"></i>
                  </div>
                  <div className="content">
                    <h4>Smart Matching</h4>
                    <div className="text">
                      Connect donors and recipients based on urgency, location, and needs for quick impact.
                    </div>
                    <Link to="/learnmore#features" className="button">
                      Read More<i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

 <div className="col-lg-6">
                <div className="features-block">
                  <div className="icon-box s-two">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <div className="content">
                    <h4>Fraud Detection</h4>
                    <div className="text">
                      Detect fake applications instantly with smart monitoring, keeping donations safe.
                    </div>
                    <Link to="/learnmore#features" className="button">
                      Read More<i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="features-block">
                  <div className="icon-box style-four">
                    <i class="bi bi-cash-stack"></i>
                  </div>
                  <div className="content">
                    <h4>Secure Payments</h4>
                    <div className="text">
                     Secure, encrypted payments trusted by NGOs and donors worldwide.
                    </div>
                    <Link to="/learnmore#features" className="button">
                      Read More<i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="causes">
          <div className="theme_container">
            <div className="title-box">
              <div className="sub-title mb-20">
                Popular Causes
              </div>
              <h2 className="sec-title mb-56">
                How We Help People For <br /> Charity Foundation
              </h2>
            </div>

            <div className="row">
              {causeCards.map((card, index) => (
                <CauseCard key={index} {...card} />
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div
            className="bg"
            style={{
              backgroundImage: "url('assets/images/background/map.png')",
            }}
          ></div>

          <div className="theme_container">
            <div className="cta-text text-center mb-40">
              <span>Small</span> Donations <span>Make</span> Bigger{" "}
              <span>Impact</span>
            </div>
            <div className="text text-center mb-35">
              Even a little contribution can bring hope and happiness to those in
  need. Together, we can make a real difference.
            </div>
            <div className="inner-box">
              <div className="link-btn">
                <Link to="/donor" className="primary_btn-one">
                  Make Donation<i className="far fa-heart"></i>
                </Link>
              </div>
              <div className="contact-info">
                <div className="icon">
                  <i className="flaticon-phone"></i>
                </div>
                <div className="contact-number">
                  <div className="number">
                    Hotline <br />
                    <a href="tel:+012(345)6789">
                      <span>+012(345) 6789</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gallery">
          <div className="theme_container">
            <div className="row">
              <div className="col-lg-8 col-md-8">
                <div className="gallery-block">
                  <div className="image">
                    <img src="assets/images/services/Child.jpg" alt="" />
                  </div>
                  <div className="inner-box">
                    <h4>
                      <Link to="/learnmore">Happy Child Group</Link>
                    </h4>
                    <div className="text">Carity Fund</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 flex-box-one">
                <div className="gallery-block">
                  <div className="image">
                    <img src="assets/images/services/Child-2.jpg" alt="" />
                  </div>
                  <div className="inner-box">
                    <h4>
                      <Link to="/learnmore">Happy Child Group</Link>
                    </h4>
                    <div className="text">Carity Fund</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="gallery-block">
                  <div className="image">
                    <img src="assets/images/services/Child-3.jpg" alt="" />
                  </div>
                  <div className="inner-box">
                    <h4>
                      <Link to="/learnmore">Happy Child Group</Link>
                    </h4>
                    <div className="text">Carity Fund</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-8">
                <div className="gallery-block">
                  <div className="image">
                    <img src="assets/images/services/Child-4.jpg" alt="" />
                  </div>
                  <div className="inner-box">
                    <h4>
                      <Link to="/learnmore">Happy Child Group</Link>
                    </h4>
                    <div className="text">Carity Fund</div>
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
        <i className="fas fa-angle-up"></i>
      </a>
    </>
  );
};

export default Services;
