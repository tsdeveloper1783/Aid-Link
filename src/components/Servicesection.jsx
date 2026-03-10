import { useEffect } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: "fa-handshake-angle",
    title: "Support Students",
    image: "01.jpg",
    text: "Help provide education and hope for a brighter future."
  },
  {
    icon: "fa-truck-medical",
    title: "Support Patients",
    image: "02.jpg",
    text: "Provide vital treatment and care for those in real need."
  },
  {
    icon: "fa-plate-wheat",
    title: "Feed the Hungry",
    image: "03.jpg",
    text: "Deliver food and relief to families living in hardship"
  },
  {
    icon: "fa-hands-holding-child",
    title: "Support Orphans",
    image: "04.jpg",
    text: "Give shelter, love, and care to orphans for their future."
  },
];

const ServicesSection = () => {
  useEffect(() => {
    const $ = window.jQuery;

    $(".causes-item-carousel2").owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 7000,
      smartSpeed: 500,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 },
        1200: { items: 4 },
      },
    });

    $(".carousel-nav-btn-s-1-prev2").click(() => {
      $(".causes-item-carousel2").trigger("prev.owl.carousel");
    });

    $(".carousel-nav-btn-s-1-next2").click(() => {
      $(".causes-item-carousel2").trigger("next.owl.carousel");
    });
  }, []);

  return (
    <section className="service-section">
      <div
        className="bg"
      ></div>

      <div className="theme_container">
        <div className="title-box">
          <div className="sub-title mb-20">
            What We Do
          </div>
          <h2 className="sec-title mb-40">
            We Work Differently to <br />
            <span>keep The World Safe</span>
          </h2>

          <div className="cause-carousel-nav-btn carousel-nav-btn-s-1 owl-nav-s-1 s-3">
            <a
              href="#"
              className="carousel-nav-btn-s-1-prev carousel-nav-btn-s-1-prev2"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa fa-angle-left"></i>
            </a>
            <a
              href="#"
              className="carousel-nav-btn-s-1-next carousel-nav-btn-s-1-next2"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa fa-angle-right"></i>
            </a>
          </div>
        </div>

        <div className="causes-item-carousel2 owl-carousel owl-theme">
          {services.map((service, index) => (
            <div className="column" key={index}>
              <div
                className="service-block"
                style={{
                  backgroundImage: `url(assets/images/services/${service.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="icon">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
                <h4>{service.title}</h4>
                <div className="text">
                  {service.text}
                </div>
                <Link to="/Learnmore">
                  <span>Read More</span>{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
