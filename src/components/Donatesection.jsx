import React, { useState } from "react";
import { Link } from "react-router-dom";

const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const amounts = [1000, 500, 100, 25];

  return (
    <section className="donar">
      <div className="theme_container">
        

        <div className="row no-gutters">
          {/* Left Side */}
          <div className="col-lg-6">
            <div className="donar-block">
              <div className="sub-title mb-20 s-two">
                Make Donate
              </div>

              <h2 className="sec-title s-two mb-30">Become a Donor</h2>

              {/* Email Input */}
              <div className="bottom">
                <form className="about-section-two-form">
                  <div className="about-section-two-input-box">
                    <input
                      type="email"
                      placeholder="Email address"
                      name="email"
                    />
                  </div>
                </form>
              </div>

              {/* Donation Amounts */}
              <div className="project-form s-two">
                <ul className="donation-amount">
                  {amounts.map((amount, index) => (
                    <li
                      key={index}
                      className={`donation-form-one-price-value ${
                        selectedAmount === amount ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                    >
                      ${amount}
                    </li>
                  ))}

                  {/* Custom Amount */}
                  <li
                    className={`other-input ${
                      selectedAmount === "custom" ? "active" : ""
                    }`}
                  >
                    <input
                      type="number"
                      placeholder="Other"
                      value={customAmount}
                      onFocus={() => setSelectedAmount("custom")}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </li>
                </ul>

                <div>
                  <Link to="/donate" className="primary_btn-two mt-5">
                    Donate <i className="far fa-heart"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Image */}
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
  );
};

export default DonationSection;