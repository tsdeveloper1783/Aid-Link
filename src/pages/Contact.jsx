import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const ContactPage = () => {
  return (
    <>
      <Header />
      {/* Breadcrumb Section */}
      <section
        className="page-title"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://plus.unsplash.com/premium_photo-1675842663249-a8b70103dbaa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
              <div className="title">
                <h1>Contact Us</h1>
              </div>
              <ul className="bread-crumb">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="theme_container">
          <div className="contact-block">
            <div className="contact-form-block style-three">
              <h4>Send Message</h4>
              <div className="text">
                We will get back to you within 24 hours after receiving your
                message.
              </div>

              <form method="post" action="inc/sendemail.php" id="contact-form">
                <div className="row">
                  <div className="form-group col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="form_name"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      name="form_phone"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <textarea
                      name="form_message"
                      className="form-control"
                      placeholder="Write a message"
                    ></textarea>
                  </div>
                  <div className="form-group col-md-12">
                    <input
                      id="form_botcheck"
                      name="form_botcheck"
                      className="form-control"
                      type="hidden"
                      value=""
                    />
                    <button
                      className="primary_btn btn-style-one"
                      type="submit"
                      data-loading-text="Please wait..."
                    >
                      <span>Send a Message</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="our-contact-section">
        <div className="theme_container">
          <div className="sub-title mb-20">
            <span className="title-sep-left">
              <img src="assets/images/resource/icon-4.png" alt="" />
            </span>
            Contact Us
          </div>
          <h2 className="sec-title mb-56">
            Are You Ready To Donate <br /> Or Need Any Info?
          </h2>
          <div className="row">
            {[
              {
                icon: "flaticon-map",
                title: "Location 1",
                text: "123 Dummy Street, Floor 1, Dummy City",
              },
              {
                icon: "flaticon-map",
                title: "Location 2",
                text: "456 Fake Avenue, Block A, Imaginary Town",
              },
              {
                icon: "flaticon-envelope",
                title: "Email Us",
                text: "example@mail.com\ncontact@dummy.org",
              },
              {
                icon: "flaticon-phone",
                title: "Hotline",
                text: "+111 222 333\n+444 555 666",
              },
            ].map((item, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="our-contact-block">
                  <div className="icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="content">
                    <h5>{item.title}</h5>
                    <div className="text">
                      {item.text.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      {/* <section className="map-section">
        <div className="theme_container">
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55945.16225505631!2d-73.90847969206546!3d40.66490264739892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1601263396347!5m2!1sen!2sbd"
              width="600"
              height="700"
              frameBorder="0"
              style={{ border: 0, width: "100%" }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </section> */}

      <Footer />
    </>
  );
};

export default ContactPage;
