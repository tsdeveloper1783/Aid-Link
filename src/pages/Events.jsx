import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";   
import Header from "../components/Header";
import Footer from "../components/Footer";

const EventsPage = () => {

const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Smooth scroll after small delay (page render hone ke baad)
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [location]);


  const events = [
    {
      id: 1,
      title: "Charity Walk for Education",
      date: "October 12, 2025",
      location: "City Park, Lahore",
      image: "https://via.placeholder.com/600x400",
      description:
        "Join us for a charity walk to support children's education. Together we can build a brighter future.",
    },
    {
      id: 2,
      title: "Health Awareness Camp",
      date: "November 5, 2025",
      location: "Community Hall, Karachi",
      image: "https://via.placeholder.com/600x400",
      description:
        "A free medical check-up camp to promote health awareness and provide support to local communities.",
    },
    {
      id: 3,
      title: "Fundraising Gala Dinner",
      date: "December 20, 2025",
      location: "Grand Hotel, Islamabad",
      image: "https://via.placeholder.com/600x400",
      description:
        "An evening of elegance with dinner, music, and charity auctions to support our building fund.",
    },
  ];

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <div>
          {/* Hero Section */}
          <section
            className="page-title" id="events"
  style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center"
  }}
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
                  <div className="container">
                    <h1 className="display-4 fw-bold">Our Events</h1>
                    <p className="text-white">
                      Discover inspiring events and join us in making a
                      difference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="py-5 my-4">
            <div className="container">
              <h2 className="text-center mb-4 fw-bold">Upcoming Events</h2>
              <div className="row g-4">
                {[
                  {
                    title: "Charity Walk",
                    date: "Jan 12, 2025",
                    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
                  },
                  {
                    title: "Health Camp",
                    date: "Jan 13, 2025",
                    img: "https://images.unsplash.com/photo-1722252799188-87e1db708544?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  },
                  {
                    title: "Fundraising Gala",
                    date: "Jan 14, 2025",
                    img: "https://images.unsplash.com/photo-1644822861254-c99d0022ab70?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  },
                ].map((event, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="card h-100 shadow-sm border-0">
                      <img
                        src={event.img}
                        className="card-img-top"
                        alt={event.title}
                        style={{
                          height: "220px", // fix height for all images
                          objectFit: "cover", // crop properly without stretching
                          borderTopLeftRadius: "0.5rem",
                          borderTopRightRadius: "0.5rem",
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{event.title}</h5>
                        <p className="small main-color mb-2">
                          <i className="fa-regular fa-calendar-days main-color me-1"></i>
                          {event.date}
                        </p>
                        <p className="card-text pb-2">
                          Join us for an inspiring event to support local
                          communities through meaningful initiatives.
                        </p>
                        <Link to="/Learnmore" className="primary_btn py-2 mb-3">
                          Learn More <i className="far fa-heart"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Event Highlight */}
          <section className="py-5 mb-5">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="highlight"
                    className="img-fluid rounded shadow"
                  />
                </div>
                <div className="col-md-6">
                  <h2 className="fw-bold pb-2">Annual Fundraising Gala</h2>
                  <p className="text-muted">
                    <i className="fa-solid fa-location-dot me-1"></i> Lahore •{" "}
                    <i className="fa-regular fa-calendar-days me-1"></i> Feb 5,
                    2025
                  </p>
                  <p className="py-3">
                    This year’s gala will bring together change-makers, donors,
                    and volunteers to raise funds for building sustainable
                    schools and medical facilities.
                  </p>
                  <Link to="/Learnmore" className="primary_btn py-2">
                    Learn More <i className="fa-solid fa-ticket"></i>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="text-center text-white py-5"
            style={{ backgroundColor: "#90be54" }}
          >
            <div className="container">
              <h2 className="fw-bold mb-3 text-white">Be Part of the Change</h2>
              <p className="mb-4">
                Join our upcoming events and contribute to building a brighter
                tomorrow.
              </p>
              <Link to="/Register" className="primary_btn-two small">
                Join Now <i className="fa-solid fa-handshake-angle"></i>
              </Link>
            </div>
          </section>

          <Footer />
        </div>
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

export default EventsPage;
