import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Replace with your real Stripe publishable key
const stripePromise = loadStripe("pk_test_your_stripe_public_key_here");

const DonateFormInner = ({
  donorInfo,
  setDonorInfo,
  recipients,
  stats,
  fetchDonations,
  fetchStats,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (recipients && recipients.length && !recipientId) {
      setRecipientId(recipients[0].id || "");
    }
  }, [recipients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo((p) => ({ ...p, [name]: value }));
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!donorInfo.amount || parseFloat(donorInfo.amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!stripe || !elements) {
      alert("Payment system not ready. Try again in a moment.");
      return;
    }

    setLoading(true);
    setSending(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${donorInfo.firstname || ""} ${donorInfo.lastname || ""}`.trim(),
          email: donorInfo.email || "",
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        setSending(false);
        return;
      }

      // ✅ UPDATED: New payload structure for our backend
      const payload = {
        amount: parseFloat(donorInfo.amount),
        description: purpose || "General donation",
        recipient: recipientId || null,
        payment_method_id: paymentMethod.id,
        donor_name: `${donorInfo.firstname || ""} ${donorInfo.lastname || ""}`.trim() || "Anonymous Donor",
        donor_email: donorInfo.email || "",
        category: "General",
      };

      // ✅ UPDATED: Use our new API endpoint with authentication
      try {
        const token = localStorage.getItem('access_token');
        await axiosInstance.post("/api/donations/", payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (createErr) {
        console.error("createDonation error:", createErr);
        const errorMsg =
          createErr?.response?.data?.error ||
          createErr?.response?.data?.detail ||
          "Donation failed on server.";
        alert(errorMsg);
        setLoading(false);
        setSending(false);
        return;
      }

      alert("Donation submitted successfully! Thank you for your generosity.");

      // Clear fields and card
      setDonorInfo({
        firstname: "",
        lastname: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
        amount: "",
        donateType: "once",
        email: "",
      });
      setPurpose("");
      setRecipientId("");
      if (cardElement && cardElement.clear) cardElement.clear();

      // Refresh data
      await fetchDonations();
      if (typeof fetchStats === "function") await fetchStats();
      
    } catch (err) {
      console.error("Donation error:", err);
      alert(err?.response?.data?.error || "Donation failed. Please try again.");
    } finally {
      setLoading(false);
      setSending(false);
    }
  };

  return (
    <form role="form" id="payment-form" onSubmit={handleDonate}>
      <div className="row">
        <div className="col-xs-12">
          <div className="form-group">
            <label htmlFor="cardNumber">CARD NUMBER</label>
            <div className="input-group">
              <div style={{ width: "100%", padding: "8px 10px", border: "1px solid #e6e6e6", borderRadius: 4 }}>
                <CardElement 
                  options={{ 
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    }
                  }} 
                />
              </div>
              <span className="input-group-block">
                <i className="fa fa-credit-card"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Information - Optional fields */}
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="firstname">First Name (Optional)</label>
            <input
              id="firstname"
              type="text"
              className="form-control"
              name="firstname"
              placeholder="John"
              value={donorInfo.firstname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="lastname">Last Name (Optional)</label>
            <input
              id="lastname"
              type="text"
              className="form-control"
              name="lastname"
              placeholder="Doe"
              value={donorInfo.lastname}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="email">Email (Optional - for receipt)</label>
            <input
              id="email"
              type="email"
              className="form-control"
              name="email"
              placeholder="john@example.com"
              value={donorInfo.email}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Donation Details */}
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="amount">Amount (PKR)</label>
            <div className="input-group">
              <input
                id="amount"
                type="number"
                className="form-control"
                name="amount"
                placeholder="5000"
                required
                min="1"
                value={donorInfo.amount}
                onChange={(e) => setDonorInfo((p) => ({ ...p, amount: e.target.value }))}
              />
              <span className="input-group-block">
                <i className="fa fa-money-bill"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <label htmlFor="donateType">Donation Type</label>
          <select
            name="donateType"
            id="donateType"
            className="form-control"
            value={donorInfo.donateType}
            onChange={(e) => setDonorInfo((p) => ({ ...p, donateType: e.target.value }))}
          >
            <option value="once">One-time</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Recipient Selection */}
      <div className="row mt-3">
        <div className="col-md-8">
          <label>Donate To Specific Recipient</label>
          <select
            className="form-control"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          >
            <option value="">General Fund (Distributed where most needed)</option>
            {recipients && recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name} - {recipient.location} ({recipient.category})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label>Purpose / Note</label>
          <input
            type="text"
            className="form-control"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Education support"
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="row mt-3">
        <div className="col-xs-12">
          <div className="alert alert-info">
            <i className="fa fa-lock"></i> Your payment is secure and encrypted. 
            We never store your credit card details.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="row">
        <div className="col-xs-12 mt-3">
          <button 
            className="primary_btn" 
            type="submit" 
            disabled={loading || sending || !donorInfo.amount}
            style={{ 
              opacity: (loading || sending || !donorInfo.amount) ? 0.6 : 1
            }}
          >
            {loading || sending ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Processing Donation...
              </>
            ) : (
              <>
                Donate Now <i className="far fa-heart"></i>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-12">
          <p className="payment-errors text-danger text-center mt-2"></p>
        </div>
      </div>
    </form>
  );
};

const Donate = () => {
  const location = useLocation();

  // donor form state
  const [donorInfo, setDonorInfo] = useState({
    firstname: "",
    lastname: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    amount: "",
    donateType: "once",
    email: "",
  });

  const [donations, setDonations] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);

  // Smooth scroll if hash present
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [location]);

  // ✅ UPDATED: Fetch donations from our new API
  const fetchDonations = async () => {
    setLoadingDonations(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get("/api/dashboard/donations/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDonations(response.data || []);
    } catch (err) {
      console.error("fetchDonations error:", err);
      // If error, set empty array but don't show error to user
      setDonations([]);
    } finally {
      setLoadingDonations(false);
    }
  };

  // ✅ UPDATED: Fetch recipients from our new API
  const fetchRecipients = async () => {
    setLoadingRecipients(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get("/api/dashboard/recipients/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRecipients(response.data || []);
    } catch (err) {
      console.error("fetchRecipients error:", err);
      // If error, set empty array but don't show error to user
      setRecipients([]);
    } finally {
      setLoadingRecipients(false);
    }
  };

  // ✅ UPDATED: Fetch stats from our new API
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get("/api/dashboard/stats/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data || { total_donated: 0, donations_count: 0 });
    } catch (err) {
      console.error("fetchStats error:", err);
      // If error, set default stats
      setStats({ total_donated: 0, donations_count: 0, last_donation: 'No donations yet' });
    } finally {
      setLoadingStats(false);
    }
  };

  // ✅ UPDATED: Download receipt function
  const downloadReceipt = async (donationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get(`/api/donations/${donationId}/receipt/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `donation_receipt_${donationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("downloadReceipt error:", err);
      alert("Receipt is not available yet. Please try again later.");
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchRecipients();
    fetchStats();
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <Header />
        <section
          className="page-title"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1657101736083-92e59db017a2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
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
                <div className="title mt-5">
                  <h1>Donate for Needies</h1>
                </div>
                <div className="text-white text-center">
                  Your donation is being made to this selected recipient. 
                  It will be securely delivered to them through our website, ensuring it reaches the intended person safely. <br /> {" "}
                  <Link
                    to="/donor"
                    style={{ color: "#ffac00", fontWeight: "bold" }}
                  >
                    Browse More Recipients
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="donate-page donate-form-s-one" id="donationform">
          <div className="theme_container">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h3 className="panel-title">Payment Details</h3>
                      </div>
                      <div className="panel-body">
                        <Elements stripe={stripePromise}>
                          <DonateFormInner
                            donorInfo={donorInfo}
                            setDonorInfo={setDonorInfo}
                            recipients={recipients}
                            stats={stats}
                            fetchDonations={fetchDonations}
                            fetchStats={fetchStats}
                          />
                        </Elements>
                      </div>
                    </div>
                  </div>

                  {/* Available Recipients Section */}
                  <div className="col-md-12 col-lg-12 mt-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h3 className="panel-title">Available Recipients</h3>
                      </div>
                      <div className="panel-body">
                        {loadingRecipients ? (
                          <div className="text-center">
                            <div className="spinner-border text-success" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-2">Loading recipients...</p>
                          </div>
                        ) : recipients.length > 0 ? (
                          <div className="row">
                            {recipients.slice(0, 6).map((recipient) => (
                              <div key={recipient.id} className="col-md-6 col-lg-4 mb-3">
                                <div className="card recipient-card h-100">
                                  <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                      <img 
                                        src={recipient.image || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                                        alt={recipient.name}
                                        className="rounded-circle me-3"
                                        width="50"
                                        height="50"
                                      />
                                      <div>
                                        <h6 className="mb-1">{recipient.name}</h6>
                                        <small className="text-muted">
                                          <i className="fa fa-map-marker-alt me-1"></i>
                                          {recipient.location}
                                        </small>
                                      </div>
                                    </div>
                                    <p className="card-text small text-muted mb-2">
                                      {recipient.reason?.substring(0, 100)}...
                                    </p>
                                    <div className="progress mb-2" style={{ height: '6px' }}>
                                      <div 
                                        className="progress-bar bg-success" 
                                        style={{ width: `${recipient.progress || 0}%` }}
                                      ></div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small className="text-success">
                                        <strong>PKR {recipient.donated?.replace('PKR ', '') || 0}</strong> 
                                        <span className="text-muted"> of </span>
                                        <strong>PKR {recipient.total?.replace('PKR ', '') || 0}</strong>
                                      </small>
                                      <span className={`badge ${
                                        recipient.urgency === 'Urgent' ? 'badge-danger' : 'badge-success'
                                      }`}>
                                        {recipient.urgency}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted py-4">
                            <i className="fa fa-users fa-3x mb-3"></i>
                            <p>No recipients available at the moment.</p>
                            <Link to="/donor" className="btn btn-primary">
                              Browse All Recipients
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Donations History Section */}
                  <div className="col-md-12 col-lg-12 mt-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h3 className="panel-title">Your Donation History</h3>
                      </div>
                      <div className="panel-body">
                        {loadingDonations ? (
                          <div className="text-center">
                            <div className="spinner-border text-success" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-2">Loading your donations...</p>
                          </div>
                        ) : donations.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Recipient</th>
                                  <th>Amount</th>
                                  <th>Date</th>
                                  <th>Status</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {donations.map((donation) => (
                                  <tr key={donation.id}>
                                    <td>{donation.name || 'General Fund'}</td>
                                    <td>
                                      <strong>PKR {donation.amount?.toLocaleString()}</strong>
                                    </td>
                                    <td>{donation.date}</td>
                                    <td>
                                      <span className={`badge ${
                                        donation.status === 'Completed' ? 'badge-success' : 
                                        donation.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                                      }`}>
                                        {donation.status}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => downloadReceipt(donation.id)}
                                        disabled={donation.status !== 'Completed'}
                                        title={donation.status !== 'Completed' ? 'Receipt available after completion' : 'Download receipt'}
                                      >
                                        <i className="fa fa-download"></i> Receipt
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center text-muted py-4">
                            <i className="fa fa-inbox fa-3x mb-3"></i>
                            <p>No donations yet. Make your first donation today!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Donation Statistics */}
                  {stats && (
                    <div className="col-md-12 col-lg-12 mt-4">
                      <div className="panel panel-default">
                        <div className="panel-heading">
                          <h3 className="panel-title">Your Impact</h3>
                        </div>
                        <div className="panel-body">
                          <div className="row text-center">
                            <div className="col-md-4">
                              <div className="stat-card">
                                <h3 className="text-success">PKR {stats.total_donated?.toLocaleString() || 0}</h3>
                                <p className="text-muted">Total Donated</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="stat-card">
                                <h3 className="text-primary">{stats.donations_count || 0}</h3>
                                <p className="text-muted">Donations Made</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="stat-card">
                                <h3 className="text-info">{stats.last_donation || 'No donations'}</h3>
                                <p className="text-muted">Last Donation</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Donate;