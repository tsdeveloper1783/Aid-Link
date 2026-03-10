import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <>
      <div className="container pb-5">
        <div className="terms-section pt-5">
          <h1 className="text-center mb-5 mt-3">
            <i className="fa-solid fa-scroll" style={{ color: "#90be54" }}></i>{" "}
            AidLink Terms and Conditions
          </h1>

          {/* 1. Definitions */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-book-open me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              1. Definitions
            </h4>
            <p>
              - “User” refers to anyone accessing the platform. <br />
              - “Donor” is a user who contributes donations. <br />
              - “Recipient” is a user who applies for aid. <br />
              - “Admin” refers to authorized personnel managing the system.
            </p>
          </div>

          {/* 2. User Responsibilities */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-user-check me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              2. User Responsibilities
            </h4>
            <ul className="ps-3">
              <li>
                <strong>Donors:</strong> Must provide accurate details.
                Donations are final once processed.
              </li>
              <li>
                <strong>Recipients:</strong> Must submit valid documents. Fake
                requests result in suspension.
              </li>
              <li>
                <strong>Admins:</strong> Must maintain system integrity and
                verify applications.
              </li>
            </ul>
          </div>

          {/* 3. Data Protection */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-lock me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              3. Data Protection
            </h4>
            <p>
              All personal data is encrypted and securely stored. No user data
              is shared without consent. Refer to the{" "}
              <Link to="/privacy">Privacy Policy</Link> for more details.
            </p>
          </div>

          {/* 4. Use of AI */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-robot me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              4. Use of Artificial Intelligence
            </h4>
            <p>
              AidLink uses AI to verify identities and detect fraud. Flagged
              applications are reviewed manually to ensure fairness.
            </p>
          </div>

          {/* 5. Prohibited Activities */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-ban me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              5. Prohibited Activities
            </h4>
            <ul className="ps-3">
              <li>Providing false information or documents</li>
              <li>Exploiting the system or bypassing verification</li>
              <li>Harassing users or misusing donations</li>
            </ul>
          </div>

          {/* 6. Donations and Refunds */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-hand-holding-dollar me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              6. Donations and Refunds
            </h4>
            <p>
              Donations are final and non-refundable unless a technical or
              fraud-related issue occurs.
            </p>
          </div>

          {/* 7. Termination */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-user-slash me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              7. Termination
            </h4>
            <p>
              We reserve the right to suspend or delete accounts that violate
              these terms or show suspicious activity.
            </p>
          </div>

          {/* 8. Modifications */}
          <div className="term-block mb-4">
            <h4>
              <i
                className="fa-solid fa-pen-fancy me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              8. Modifications
            </h4>
            <p>
              Terms and Conditions may be updated at any time. Changes will be
              shared via the website or email.
            </p>
          </div>

          {/* 9. Contact */}
          <div className="term-block text-center mt-5">
            <h4>
              <i
                className="fa-solid fa-envelope me-2"
                style={{ color: "#90be54" }}
              ></i>{" "}
              9. Contact
            </h4>
            <p>
              For any queries, contact us at{" "}
              <strong>support@aidlink.com</strong>
            </p>
            <Link to="/" className="primary_btn mt-3">
              <i className="fa-solid fa-arrow-left me-2"></i> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
