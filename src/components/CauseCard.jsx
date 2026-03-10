import { Link } from "react-router-dom";

const CauseCard = ({ image, heading, title, raised }) => {
  return (
    <div className="col-md-6 col-lg-3 column">
      <div className="causes-block d-flex flex-column h-100">
        <div className="image">
          <img src={`assets/images/services/${image}`} alt={heading} />
          <div className="progress-wrap">
            <div className="progress-box">
              <div className="inner-box"></div>
            </div>
            <div className="content">
              <h4>{heading}</h4>
              <div className="text">
                Raised <span className="crl4">${raised}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lower-content d-flex flex-column justify-content-between flex-grow-1">
       
          <h4 style={{ minHeight: "60px", lineHeight: "1.4" }}>{title}</h4>

         
          <Link
            to="/donor"
            className="primary_btn text-center mb-3"
            style={{ display: "block", padding: "12px 0", fontWeight: "600" }}
          >
            Donation <i className="far fa-heart ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CauseCard;
