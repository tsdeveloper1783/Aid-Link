import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";   
import Header from "../components/Header";
import Footer from "../components/Footer";


const NewsletterPage = () => {

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

  const newsletters = [
    {
      id: 1,
      title: "Monthly Aid-Link Newsletter",
      date: "August 2025",
      image: "https://plus.unsplash.com/premium_photo-1683140538884-07fb31428ca6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Catch up on our latest projects, community impact stories, and ways you can help make a difference.",
    },
    {
      id: 2,
      title: "Community Spotlight",
      date: "July 2025",
      image: "https://plus.unsplash.com/premium_photo-1663089162887-403fb53108cd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Highlighting stories from our local communities where Aid-Link has made a positive impact.",
    },
    {
      id: 3,
      title: "Fundraising Updates",
      date: "June 2025",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "See how your contributions are being used and the progress we’ve made in our ongoing campaigns.",
    },
  ];

  return (
    <>
      <Header />
      <div className="page-wrapper">
        {/* Hero Section */}
        <section
          className="page-title" id="news"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551883877-e82f4b4dd436?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textAlign: "center",
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
                  <h1 className="display-4 fw-bold">Our Newsletters</h1>
                  <p className="text-white">
                    Stay updated with Aid-Link’s latest news and campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Newsletters */}
        <section className="py-5 my-4">
          <div className="container">
            <h2 className="text-center mb-4 fw-bold">Latest Newsletters</h2>
            <div className="row g-4">
              {newsletters.map((newsletter, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      src={newsletter.image}
                      className="card-img-top"
                      alt={newsletter.title}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{newsletter.title}</h5>
                      <p className="small main-color mb-2">
                        <i className="fa-regular fa-calendar-days main-color me-1"></i>
                        {newsletter.date}
                      </p>
                      <p className="card-text pb-2">{newsletter.description}</p>
                      <Link
                        to="/Learnmore"
                        className="primary_btn py-2 mb-3"
                      >
                        Learn More <i className="far fa-heart"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


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

export default NewsletterPage;
