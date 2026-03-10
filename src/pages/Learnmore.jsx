import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";   
import Header from "../components/Header";
import Footer from "../components/Footer";



const Learnmore = () => {
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
  
  return (
    <>
      <Header />

      <div className="container py-5" id="learnmore">
        <h2 className="text-center mb-4 mt-5 pt-5">
          <i className="bi bi-lightbulb-fill" style={{ color: "#90be54" }}></i> How AidLink Works
        </h2>

        {/* Mission */}
        <div className="row mb-5">
          <div className="col-md-12">
            <div className="info-card bg-light p-4 rounded shadow-sm">
              <h4 className="mb-3">
                <i className="bi bi-bullseye section-icon me-2" style={{ color: "#90be54" }}></i> Our Mission
              </h4>
              <p className="text">
                AidLink is designed to bridge the gap between verified aid seekers and responsible donors.
                Our goal is to eliminate fraud and bring AI-powered transparency into the donation process.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-step Section */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4">
            <div className="info-card bg-white p-4 rounded shadow-sm h-100">
              <h4>
                <i className="bi bi-person-lines-fill section-icon me-2" style={{ color: "#90be54" }}></i> For Recipients
              </h4>
              <div className="step my-2"><i className="bi bi-pencil-square me-2"></i> Register and fill out the Aid Application form</div>
              <div className="step my-2"><i className="bi bi-cloud-upload-fill me-2"></i> Upload CNIC and supporting documents</div>
              <div className="step my-2"><i className="bi bi-shield-check me-2"></i> Let our AI verify your details securely</div>
              <div className="step my-2"><i className="bi bi-check2-circle me-2"></i> If approved, your case goes live for donors</div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="info-card bg-white p-4 rounded shadow-sm h-100">
              <h4>
                <i className="bi bi-heart-fill section-icon me-2" style={{ color: "#90be54" }}></i> For Donors
              </h4>
              <div className="step my-2"><i className="bi bi-search-heart me-2"></i> Browse through AI-verified applications</div>
              <div className="step my-2"><i className="bi bi-gem me-2"></i> Filter by urgency, type, or suggested matches</div>
              <div className="step my-2"><i className="bi bi-credit-card me-2"></i> Make a secure donation online</div>
              <div className="step my-2"><i className="bi bi-file-earmark-check me-2" id="education"></i> Get impact reports & donor satisfaction updates</div>
            </div>
          </div>
        </div>


        

       {/*  Services Section */}
<div className="row mb-5">
  <div className="col-md-12">
    <h3 className="mb-4 text-center">
      <i className="bi bi-gear-fill section-icon me-2" style={{ color: "#90be54" }}></i> Categories
    </h3>
  </div>

  {/* Service 1 */}
  <div className="col-md-12 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm">
     <h4 className="mb-3">
        <i className="bi bi-cash-stack section-icon me-2" style={{ color: "#90be54" }}></i> Support Students
      </h4>
      <p className="text" id="health">
        Education is the key to breaking the cycle of poverty. AidLink connects donors with
        deserving students who struggle to afford tuition, books, and school supplies. By supporting
        students, you are not just helping them study—you are investing in the future of entire families
        and communities. Every contribution brings hope, confidence, and opportunities for young minds
        to shine.
      </p>
    </div>
  </div>

  {/* Service 2 */}
  <div className="col-md-12 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm">
      <h4 className="mb-3">
        <i className="bi bi-heart-fill section-icon me-2" style={{ color: "#90be54" }}></i> Care for Patients
      </h4>
      <p className="text" id="food">
        Thousands of patients struggle daily without access to affordable medical care. Through AidLink,
        donors can directly support life-saving treatments, hospital expenses, and medicines for those in
        need. Our mission is to extend healing with dignity—because every person deserves the chance to
        recover and live a healthy life. With your support, we bring hope and comfort to patients and their families.
      </p>
    </div>
  </div>

  {/* Service 3 */}
  <div className="col-md-12 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm">
      <h4 className="mb-3">
        <i className="bi bi-basket-fill section-icon me-2" style={{ color: "#90be54" }}></i> Feed the Hungry
      </h4>
      <p className="text" id="orphans">
        Hunger is one of the greatest challenges faced by underprivileged communities. AidLink ensures
        that your donations provide fresh meals and nutrition packs directly to struggling families.
        Together, we can fight food insecurity, bring dignity to dining tables, and ensure no one sleeps
        hungry. Your small contribution can fill plates, light up smiles, and restore hope where it is needed most.
      </p>
    </div>
  </div>

  {/* Service 4 */}
  <div className="col-md-12 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm">
      <h4 className="mb-3">
        <i className="bi bi-emoji-smile-fill section-icon me-2" style={{ color: "#90be54" }}></i> Support Orphans
      </h4>
      <p className="text" >
        Orphaned children are among the most vulnerable members of society. AidLink creates a bridge
        between donors and orphanages or individual children in need of shelter, education, clothing,
        and emotional support. By supporting orphans, you are not just giving them basic necessities—
        you are giving them love, safety, and the foundation for a brighter tomorrow. Every orphan deserves
        a family, and with your help, we bring them closer to one.
      </p>
    </div>
  </div>
</div>


{/* Security & Transparency */}
        <div className="row mb-5">
          <div className="col-md-12">
            <div className="info-card bg-light p-4 rounded shadow-sm">
              <h4 className="mb-3">
                <i className="bi bi-lock-fill section-icon" style={{ color: "#90be54" }}></i> Security & Transparency
              </h4> 
              <p className="text">
                AidLink ensures your donations are traceable, your data is encrypted, and your trust is protected.
                We log every donation, flag suspicious cases, and allow only verified users to receive help.
              </p>
            </div>
          </div>
        </div>


        {/* Key Features Section */}
<div className="row mb-5" id="features">
  <div className="col-md-12">
    <h3 className="mb-5 mt-5 text-center">
      <i className="bi bi-stars section-icon me-2" style={{ color: "#90be54" }}></i> Key Features
    </h3>
  </div>

  {/* Feature 1 */}
  <div className="col-md-6 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm h-100">
      <h4>
        <i className="bi bi-cpu-fill section-icon me-2" style={{ color: "#90be54" }}></i> AI Powered Matching
      </h4>
      <p className="text">
        Our smart AI system automatically connects donors with the most suitable recipients based on
        their needs, preferences, and location. This ensures faster, transparent, and highly effective
        matching—making sure that your donation reaches the right person at the right time.
      </p>
    </div>
  </div>

  {/* Feature 2 */}
  <div className="col-md-6 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm h-100">
      <h4>
        <i className="bi bi-shield-check section-icon me-2" style={{ color: "#90be54" }}></i> Fraud Detection
      </h4>
      <p className="text">
        With advanced fraud detection algorithms, AidLink protects both donors and recipients. Every
        request and profile goes through multiple layers of verification to prevent scams, fake accounts,
        and misuse of donations—ensuring trust and safety across the platform.
      </p>
    </div>
  </div>

  {/* Feature 3 */}
  <div className="col-md-6 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm h-100">
      <h4>
        <i className="bi bi-lock-fill section-icon me-2" style={{ color: "#90be54" }}></i> Secure Payments
      </h4>
      <p className="text">
        All donations are processed through secure and encrypted payment gateways. Whether you choose
        to donate once or set up recurring contributions, you can have peace of mind that your funds are
        transferred safely and transparently, without any hidden charges.
      </p>
    </div>
  </div>

  {/* Feature 4 */}
  <div className="col-md-6 mb-4">
    <div className="info-card bg-white p-5 rounded shadow-sm h-100">
      <h4>
        <i className="bi bi-person-check-fill section-icon me-2" style={{ color: "#90be54" }}></i> Verified Recipients
      </h4>
      <p className="text">
        Every recipient on AidLink undergoes an AI-powered verification process, including identity
        checks and background validation. This ensures that donors are supporting genuine individuals
        and causes, giving you full confidence that your help truly makes an impact.
      </p>
    </div>
  </div>
</div>




        {/* Get Involved */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="info-card text-center bg-white p-5 rounded shadow-sm">
              <h3 className="mb-3">
                <i className="bi bi-people-fill section-icon" style={{ color: "#90be54" }}></i> Get Involved
              </h3>
              <p className="text mb-2">
                Join AidLink as a Donor, Admin, or Volunteer and be part of a technology-driven social impact revolution.
              </p>
              <Link to="/register" className="primary_btn px-4 mt-2">
                <i className="bi bi-person-plus"></i> Join Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Learnmore;
