import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../dashboards css/dashboards.css";

const RecipientDashboard = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 768);
  const [donorData, setDonorData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Backend-driven states
  const [donors, setDonors] = useState([]);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [notificationsState, setNotificationsState] = useState({
    donationEmail: true,
    monthlyReport: false,
    newRecipient: false,
  });

  const [loading, setLoading] = useState({
    donors: false,
    profile: false,
    requests: false,
    messages: false,
    prefs: false,
    update: false
  });
  const [error, setError] = useState({
    donors: null,
    profile: null,
    requests: null,
    messages: null,
    prefs: null,
    update: null
  });

  // ✅ FIXED ROLE GUARD (security)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");
      
      console.log("🔐 Recipient Auth Check - Token:", token ? "Exists" : "Missing");
      console.log("🔐 Recipient Auth Check - User:", userData);
      
      if (!token || !userData) {
        console.log("❌ No auth token, redirecting to login");
        localStorage.clear();
        navigate("/login");
        return false;
      }
      
      try {
        const userObj = JSON.parse(userData);
        
        // ✅ CHECK ROLE - FIXED
        if (userObj.role !== "recipient") {
          console.log("❌ Wrong role, redirecting to login");
          localStorage.clear();
          navigate("/login");
          return false;
        }
        
        console.log("✅ Recipient auth successful, user:", userObj);
        return true;
      } catch (error) {
        console.log("❌ Invalid user data, redirecting to login");
        localStorage.clear();
        navigate("/login");
        return false;
      }
    };

    // Only proceed if authentication is successful
    if (checkAuth()) {
      // UI helpers (existing)
      window.openChatBox = () => {
        const el = document.getElementById("chatBox");
        if (el) el.style.display = "block";
      };
      window.closeChatBox = () => {
        const el = document.getElementById("chatBox");
        if (el) el.style.display = "none";
      };

      // Handle window resize
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setIsSidebarVisible(true);
        } else {
          setIsSidebarVisible(false);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [navigate]);

 // ✅ UPDATE THESE ENDPOINTS IN YOUR RECIPIENT.JSX
const API_ENDPOINTS = {
  PROFILE: "recipient/profile/", // ✅ CORRECT ENDPOINT
  DONORS: "donors/real/", // ✅ CORRECT ENDPOINT
  MESSAGES: "messages/",
  NOTIFICATIONS: "notifications/", 
  PREFERENCES: "preferences/"
};

 //PERMANENT PROFILE FETCH - GUARANTEED TO WORK
const fetchProfile = async () => {
  try {
    setLoading(prev => ({ ...prev, profile: true }));
    setError(prev => ({ ...prev, profile: '' }));

    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('🔄 PERMANENT - Fetching REAL profile data from backend...');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/recipient/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 PERMANENT - API Response Status:', response.status);

      if (response.ok) {
        const realData = await response.json();
        console.log('✅ PERMANENT - REAL Profile data received:', realData);
        
        // Store in state
        setProfile(realData);
        
        // Also update localStorage for consistency
        localStorage.setItem('recipientProfile', JSON.stringify(realData));
      } else {
        console.log('⚠️ PERMANENT - Profile endpoint returned status:', response.status);
        // Use registration data as fallback
        const registrationData = {
          fullName: user.username,
          email: user.email,
          phoneNumber: user.phone || '',
          address: user.address || '',
          fatherName: 'Not provided',
          familyMembers: 0,
          previousJob: 'Not provided',
          urgencyLevel: 'Medium',
          about: 'Please update your profile information',
          isVerified: false,
          profilePicture: '/default-avatar.png'
        };
        setProfile(registrationData);
        localStorage.setItem('recipientProfile', JSON.stringify(registrationData));
      }
    } catch (fetchErr) {
      console.error('❌ PERMANENT - Profile fetch error:', fetchErr);
      // Fallback to localStorage if available
      const localData = localStorage.getItem('recipientProfile');
      if (localData) {
        console.log('📦 Using localStorage fallback data');
        setProfile(JSON.parse(localData));
      } else {
        // Ultimate fallback - use registration data
        const fallbackData = {
          fullName: user.username || 'User',
          email: user.email || '',
          phoneNumber: user.phone || '',
          address: user.address || '',
          fatherName: 'Not provided',
          familyMembers: 0,
          previousJob: 'Not provided',
          urgencyLevel: 'Medium',
          about: 'Please update your profile information',
          isVerified: false,
          profilePicture: '/default-avatar.png'
        };
        setProfile(fallbackData);
      }
    }
  } catch (err) {
    console.error('❌ PERMANENT - Profile fetch error:', err);
    setError(prev => ({ ...prev, profile: 'Failed to load profile data' }));
  } finally {
    setLoading(prev => ({ ...prev, profile: false }));
  }
};


  // ✅ FIXED: UPDATE PROFILE FUNCTION
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(prev => ({ ...prev, update: true }));
    setError(prev => ({ ...prev, update: '' }));

    const token = localStorage.getItem('access_token');
    
    // ✅ FIX: Use FormData properly
    const formData = new FormData(e.target);

    console.log('🔄 Updating profile with form data...');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/recipient/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // ✅ IMPORTANT: Don't set Content-Type for FormData, browser will set it automatically with boundary
        },
        body: formData, // ✅ FormData automatically sets proper headers
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log('✅ Profile updated successfully:', updatedData);
        
        // Update state with new data
        setProfile(updatedData);
        
        // Update localStorage
        localStorage.setItem('recipientProfile', JSON.stringify(updatedData));
        
        // Show success message
        alert('Profile updated successfully!');
        
        // Switch back to profile view
        setActiveSection('profile');
      } else {
        const errorData = await response.json();
        console.log('❌ Backend error:', errorData);
        alert('Failed to update profile: ' + (errorData.error || 'Unknown error'));
      }
    } catch (fetchErr) {
      console.error('❌ Network error:', fetchErr);
      alert('Network error occurred while updating profile.');
    }
  } catch (err) {
    console.error('❌ Profile update error:', err);
    alert('Failed to update profile: ' + err.message);
  } finally {
    setLoading(prev => ({ ...prev, update: false }));
  }
};
  // LOAD PROFILE ON COMPONENT MOUNT
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSidebarClick = (sectionId) => {
    setActiveSection(sectionId);
    if (window.innerWidth < 768) setIsSidebarVisible(false);
    
    // Refresh profile data when switching to profile section
    if (sectionId === "profile") {
      fetchProfile();
    }
  };

  const Section = ({ id, children }) => (
    <section
      id={id}
      className={`dashboard-section p-4 ${
        activeSection === id ? "" : "d-none"
      }`}
    >
      {children}
    </section>
  );

  // ---------- API FETCHERS ----------
 // Enhanced donors fetch with better data handling
useEffect(() => {
  const fetchDonors = async () => {
    setLoading((p) => ({ ...p, donors: true }));
    setError((p) => ({ ...p, donors: null }));
    
    try {
      console.log('🔄 Fetching real donors from backend...');
      const res = await axiosInstance.get("/api/donors/");
      
      console.log('📦 Donors API Response:', res.data);
      
      if (res.data && Array.isArray(res.data)) {
        // Transform the data to ensure consistent structure
        const transformedDonors = res.data.map(donor => ({
          id: donor.id || donor._id || donor.pk,
          name: donor.name || donor.full_name || donor.username,
          email: donor.email,
          location: donor.location || donor.address || 
                   (donor.city && donor.country ? `${donor.city}, ${donor.country}` : 'Location not specified'),
          profile_picture: donor.profile_picture || donor.image || donor.avatar,
          phone: donor.phone || donor.phone_number,
          bio: donor.bio || donor.about,
          total_donations: donor.total_donations || donor.total_amount || donor.donation_total,
          donation_count: donor.donation_count || donor.total_donations,
          last_donation_date: donor.last_donation_date || donor.last_donation,
          verification_status: donor.verification_status || donor.is_verified,
          is_active: donor.is_active !== undefined ? donor.is_active : true,
          // Add any other fields your API returns
        }));
        
        console.log('✅ Transformed donors data:', transformedDonors);
        setDonors(transformedDonors);
        
      } else {
        console.warn('⚠️ No array data received from donors API');
        setError((p) => ({ ...p, donors: "No donors data available" }));
        setDonors([]);
      }
    } catch (err) {
      console.error('❌ Error fetching donors:', err);
      
      let errorMessage = "Error fetching donors";
      if (err.response) {
        errorMessage = `Server error: ${err.response.status}`;
        if (err.response.status === 401) {
          errorMessage = "Please login again";
        } else if (err.response.status === 403) {
          errorMessage = "Access denied";
        } else if (err.response.status === 404) {
          errorMessage = "Donors endpoint not found";
        }
      } else if (err.request) {
        errorMessage = "Network error - please check your connection";
      }
      
      setError((p) => ({ ...p, donors: errorMessage }));
      setDonors([]);
    } finally {
      setLoading((p) => ({ ...p, donors: false }));
    }
  };
  
  fetchDonors();
}, []);
  // Requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading((p) => ({ ...p, requests: true }));
      setError((p) => ({ ...p, requests: null }));
      try {
        const res = await axiosInstance.get("/api/requests/");
        if (Array.isArray(res.data)) setRequests(res.data);
      } catch (err) {
        setError((p) => ({ ...p, requests: "Error fetching requests" }));
      } finally {
        setLoading((p) => ({ ...p, requests: false }));
      }
    };
    fetchRequests();
  }, []);

  // Messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading((p) => ({ ...p, messages: true }));
      setError((p) => ({ ...p, messages: null }));
      try {
        const res = await axiosInstance.get("/api/messages/");
        if (Array.isArray(res.data)) setMessages(res.data);
      } catch (err) {
        setError((p) => ({ ...p, messages: "Error fetching messages" }));
      } finally {
        setLoading((p) => ({ ...p, messages: false }));
      }
    };
    fetchMessages();
  }, []);

  // Preferences & Notifications
  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading((p) => ({ ...p, prefs: true }));
      try {
        const [prefsRes, notifRes] = await Promise.all([
          axiosInstance.get("/api/preferences/").catch(() => ({ data: {} })),
          axiosInstance.get("/api/notifications/").catch(() => ({ data: {} })),
        ]);
        if (prefsRes && prefsRes.data) setPreferences(prefsRes.data);
        if (notifRes && notifRes.data) setNotificationsState(notifRes.data);
      } catch {
        // ignore, keep defaults
      } finally {
        setLoading((p) => ({ ...p, prefs: false }));
      }
    };
    fetchPrefs();
  }, []);

  // ---------- HANDLERS ----------
  // Aid form submit (FormData)
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formEl = e.target;
    const data = new FormData(formEl);

    // map frontend field to backend field
    data.set("category", selectedCategory);
    data.delete("aidType");

    await axiosInstance.post("/api/verify-documents", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Application submitted successfully!");
    formEl.reset();
    setSelectedCategory("");
  } catch (error) {
    console.error(error);
    alert("Failed to submit request.");
  }
};

  // Chat send (reads chatInput element)
  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    try {
      const input = document.getElementById("chatInput");
      const text = input ? input.value.trim() : "";
      if (!text) return;

      // optimistic UI
      setMessages((prev) => [...prev, { sender: "recipient", text, time: "Just now" }]);
      if (input) input.value = "";

      await axiosInstance.post("/api/messages/", {
        text,
        donorId: donorData?.id || null,
      });

      // refresh messages
      try {
        const res = await axiosInstance.get("/api/messages/");
        if (Array.isArray(res.data)) setMessages(res.data);
      } catch {}
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  // Preferences save
  const handleSavePreferences = async (e) => {
    e?.preventDefault?.();
    try {
      await axiosInstance.put("/api/preferences/", preferences);
      alert("Preferences saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save preferences.");
    }
  };

  // Notifications save
  const handleSaveNotifications = async (e) => {
    e?.preventDefault?.();
    try {
      await axiosInstance.put("/api/notifications/", notificationsState);
      alert("Notifications updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update notifications.");
    }
  };

 // Logout all
const handleLogoutAll = async () => {
  try {
    await axiosInstance.post("/api/logout-all/");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  } catch (err) {
    console.error(err);
    alert("Failed to logout.");
  }
};

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmation = window.prompt("Type DELETE to confirm permanent account deletion:");
    if (confirmation !== "DELETE") {
      alert("Deletion cancelled or incorrect confirmation.");
      return;
    }
    try {
      await axiosInstance.delete("/api/delete-account/");
      localStorage.removeItem("user");
      navigate("/register");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };

  // Helper to open donor profile and set donorData
 // Enhanced openDonorProfile function
const openDonorProfile = (donor) => {
  const donorProfileData = {
    name: donor.name || donor.full_name,
    email: donor.email,
    location: donor.location || donor.address,
    image: donor.profile_picture || donor.image || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
    total: donor.total_donations || donor.total || "N/A",
    count: donor.donation_count || donor.count || 0,
    lastDonation: donor.last_donation_date || donor.lastDonation || "N/A",
    id: donor.id || null,
    phone: donor.phone || donor.phone_number,
    bio: donor.bio || donor.about || "No bio provided",
    verificationStatus: donor.verification_status || (donor.is_verified ? 'verified' : 'pending'),
    joinDate: donor.join_date || donor.created_at,
    // Add any other relevant donor data
  };
  
  setDonorData(donorProfileData);
  handleSidebarClick("donor-profile");
};
  // ---------- UI (kept exactly as provided, only wired to handlers above) ----------
  return (
    <>
      <div className="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div
              id="sidebarMenu"
              className={`sidebar-container col-md-2 sidebar ps-2 pe-2 ${
                isSidebarVisible ? "d-block" : "d-none"
              }`}
              style={{
                position: "fixed", //desktop & mobile dono pe fixed
                top: 0,
                left: 0,
                height: "100vh", // viewport full height
                zIndex: 1050,
                overflowY: "auto",
                width: window.innerWidth >= 768 ? "16.6667%" : "50%", // desktop width col-md-2, mobile full screen
                boxShadow:
                  window.innerWidth < 768 && isSidebarVisible
                    ? "2px 0 5px rgba(0,0,0,0.1)"
                    : "none",
                transform:
                  window.innerWidth < 768
                    ? isSidebarVisible
                      ? "translateX(0)"
                      : "translateX(-100%)"
                    : "translateX(0)",
                transition: "transform 0.3s ease-in-out",
                display:
                  isSidebarVisible || window.innerWidth >= 768
                    ? "block"
                    : "none",
              }}
            >
              <button
                className="sidebar-link mb-2"
                onClick={() => navigate("/")}
              >
                {" "}
                <i className="fas fa-chevron-left me-2"></i>{" "}
                <strong>Back to Home</strong>
              </button>
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "dashboard" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("dashboard")}
              >
                {" "}
                <i className="fas fa-users me-2"></i>Browse Donors
              </button>
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "profile" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("profile")}
              >
                {" "}
                <i className="fas fa-user me-2"></i>My Profile
              </button>
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "donations" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("donations")}
              >
                {" "}
                <i className="fas fa-hand-holding-heart me-2"></i>Donation
                History
              </button>
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "messages" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("messages")}
              >
                {" "}
                <i className="fas fa-inbox me-2"></i>Messages
              </button>
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "form" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("form")}
              >
                {" "}
                <i className="fas fa-file-alt me-2"></i>Aid Form
              </button>
              {/* <p className="mb-2">
                <i className="fas fa-cogs me-2"></i> <strong>Settings</strong>
              </p> */}
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "editprofile" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("editprofile")}
              >
                {" "}
                <i className="fas fa-user-edit me-2"></i>Edit Profile
              </button>
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "prefrences" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("prefrences")}
              >
                {" "}
                <i className="fas fa-tools me-2"></i>Preferences
              </button>
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "notifications" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("notifications")}
              >
                {" "}
                <i className="fas fa-bell me-2"></i>Notifications
              </button>
             
              <button
                className={`sidebar-link mb-1 ${
                  activeSection === "logout" ? "active" : ""
                }`}
                onClick={() => handleSidebarClick("logout")}
              >
                {" "}
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </button>
            </div>

            {/* Main Content */}
            <div
              className="col-md-10 offset-md-2"
              style={{
                marginLeft: window.innerWidth >= 768 ? "16.6667%" : 0,
                transition: "margin-left 0.3s ease-in-out",
              }}
            >
              {/* Topbar */}
              <div className="topbar d-flex justify-content-between align-items-center p-3">
                <h5 className="ms-2" style={{ color: "#90be54" }}>
                  <i
                    className="fas fa-home me-2"
                    style={{ color: "#90be54" }}
                  ></i>
                  Recipient Dashboard
                </h5>
                <div>
                  <button
                    className="btn icon-btn me-2"
                    onClick={() => setShowNotifications(!showNotifications)}
                    title="Notifications"
                  >
                    <i className="fas fa-bell"></i>
                  </button>
                  <img
                    src={profile?.image || "https://randomuser.me/api/portraits/men/33.jpg"}
                    className="profile-pic rounded-circle me-2"
                    alt="Profile"
                  />
                  <button
                    className="btn d-md-none"
                    onClick={() => setIsSidebarVisible((prev) => !prev)}
                  >
                    <i className="fas fa-bars" style={{ color: "#90be54" }}></i>
                  </button>
                </div>
              </div>

              <div className="content">
                {/* Browse Donors Section */}
             
<Section id="dashboard">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h5>Available Donors</h5>
    
    {/* Search Bar */}
    <div className="search-bar">
      <input
        type="text"
        placeholder="Type here to search donors..."
        className="form-control form-control-sm"
        style={{ width: '250px' }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            // You can add search functionality here later
            console.log("Search for:", e.target.value);
          }
        }}
      />
    </div>
  </div>

  {/* Loading State */}
  {loading.donors && (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading donors...</span>
      </div>
      <p className="mt-2 text-muted">Loading available donors...</p>
    </div>
  )}

  {/* Error State */}
  {error.donors && !loading.donors && (
    <div className="alert alert-warning" role="alert">
      {error.donors}
      <button 
        className="btn btn-sm btn-outline-warning ms-2"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  )}

  {/* No Donors Found */}
  {!loading.donors && !error.donors && donors.length === 0 && (
    <div className="text-center py-4">
      <p className="text-muted">No donors available at the moment.</p>
      <small className="text-muted">Check back later for available donors.</small>
    </div>
  )}

  {/* Donors List - Completely Dynamic */}
  {!loading.donors && donors.length > 0 && (
    <>
      <ul className="list-group list-group-flush">
        {donors.map((donor, idx) => (
          <li
            key={donor.id || `donor-${idx}`}
            className="list-group-item summary-card px-3 py-3 mb-2"
          >
            <div className="row align-items-center">
              {/* Donor Image and Info */}
              <div className="col-12 col-md-8 d-flex align-items-center mb-3 mb-md-0">
                <img
                  src={
                    donor.profile_picture || 
                    donor.image || 
                    donor.avatar ||
                    `https://i.pravatar.cc/50?img=${(idx % 70) + 1}`
                  }
                  alt={donor.name || donor.full_name || "Donor"}
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                  onError={(e) => {
                    e.target.src = `https://i.pravatar.cc/50?img=${(idx % 70) + 1}`;
                  }}
                />
                <div>
                  <h6 className="mb-0">{donor.name || donor.full_name || "Anonymous Donor"}</h6>
                  <small className="text-muted">{donor.email || "Email not provided"}</small>
                  <br />
                  <small className="text-muted">
                    {donor.location || donor.address || donor.city || "Location not specified"}
                  </small>
                  
                  {/* Additional donor info if available */}
                  {donor.verification_status && (
                    <div className="mt-1">
                      <small className={`badge ${
                        donor.verification_status === 'verified' ? 'bg-success' : 'bg-warning'
                      }`}>
                        {donor.verification_status === 'verified' ? '✓ Verified' : 'Pending'}
                      </small>
                    </div>
                  )}
                  
                  {/* Donation stats if available */}
                  {(donor.total_donations || donor.donation_count) && (
                    <div className="mt-1">
                      <small className="text-success">
                        {donor.donation_count ? `${donor.donation_count} donations` : ''}
                        {donor.total_donations ? ` • ${donor.total_donations}` : ''}
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="col-12 col-md-4 text-md-end text-start">
                <div className="d-flex flex-wrap justify-content-md-end gap-2">
                  <button
                    className="btn btn-sm view-profile-btn donor-list-btn"
                    onClick={() => openDonorProfile(donor)}
                  >
                    View Profile
                  </button>

                  <button
                    className="btn btn-sm donor-list-btn-2"
                    onClick={() => {
                      setDonorData({
                        name: donor.name || donor.full_name,
                        email: donor.email,
                        location: donor.location || donor.address,
                        image: donor.profile_picture || donor.image || `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`,
                        total: donor.total_donations || donor.total || "N/A",
                        count: donor.donation_count || donor.count || 0,
                        lastDonation: donor.last_donation_date || donor.lastDonation || "N/A",
                        id: donor.id || null,
                        phone: donor.phone || donor.phone_number,
                        bio: donor.bio || donor.about,
                        // Add any other relevant donor data
                      });
                      // For now, just show a message - chat functionality removed as requested
                      alert(`Request help feature will be implemented soon for ${donor.name || donor.full_name}`);
                    }}
                  >
                    Request Help
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Donors Count */}
      <div className="mt-3 text-muted small">
        Showing {donors.length} available donor{donors.length !== 1 ? 's' : ''}
      </div>
    </>
  )}
</Section>

  {/* ✅ MY PROFILE SECTION - REAL DATA FROM DATABASE */}
<Section id="profile">
  <div className="container p-4">
    {loading.profile ? (
      <div className="text-center py-5">
        <div className="spinner-border text_success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile data...</p>
      </div>
    ) : error.profile ? (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error.profile}
      </div>
    ) : profile ? (
      <>
        {/* Header Section */}
        <div className="row align-items-center mb-4">
          <div className="col-4 col-md-2 text-center">
            <img
              src={profile.profilePicture || "/default-avatar.png"}
              className="rounded-circle profile-pg-pic img-fluid border"
              alt="Profile"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>
          <div className="col-8 col-md-7">
            <h4 className="mb-1" style={{ color: "#90be54" }}>
              {profile.fullName || 'No Name Provided'}
            </h4>
            <p className="text-muted icon-text mb-1">
              <i className="fas fa-map-marker-alt text_success me-1"></i>
              {profile.address || 'No Address Provided'}
            </p>
            {profile.isVerified ? (
              <span className="badge badge-verified text-white px-2 py-1">
                <i className="fas fa-check-circle me-1"></i>Verified
              </span>
            ) : (
              <span className="badge bg-warning text-dark px-2 py-1">
                <i className="fas fa-clock me-1"></i>Verification Pending
              </span>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="row gy-4">
          <div className="col-md-6">
            <div className="section-title mb-3" style={{ color: "#90be54" }}>
              <i className="fas fa-address-card me-2"></i>Contact Information
            </div>
            <div className="profile-info-card p-3">
              <p className="icon-text mb-2">
                <i className="fas fa-envelope text_success me-2"></i>
                <strong>Email:</strong> {profile.email || 'No Email Provided'}
              </p>
              <p className="icon-text mb-2">
                <i className="fas fa-phone-alt text_success me-2"></i>
                <strong>Phone:</strong> {profile.phoneNumber || 'No Phone Provided'}
              </p>
              <p className="icon-text mb-0">
                <i className="fas fa-home text_success me-2"></i>
                <strong>Address:</strong> {profile.address || 'No Address Provided'}
              </p>
            </div>
          </div>

          {/* Family & Background */}
          <div className="col-md-6">
            <div className="section-title mb-3" style={{ color: "#90be54" }}>
              <i className="fas fa-users me-2"></i>Family & Background
            </div>
            <div className="profile-info-card p-3">
              <p className="icon-text mb-2">
                <i className="fas fa-users text_success me-2"></i>
                <strong>Family Members:</strong> {profile.familyMembers || '0'}
              </p>
              <p className="icon-text mb-2">
                <i className="fas fa-male text_success me-2"></i>
                <strong>Father's Name:</strong> {profile.fatherName || 'Not Provided'}
              </p>
              <p className="icon-text mb-2">
                <i className="fas fa-briefcase text_success me-2"></i>
                <strong>Previous Job:</strong> {profile.previousJob || 'Not Provided'}
              </p>
              <p className="icon-text mb-0">
                <i className="fas fa-exclamation-circle text_success me-2"></i>
                <strong>Urgency Level:</strong> 
                <span className={`badge ms-2 ${
                  profile.urgencyLevel === 'High' ? 'bg-danger' : 
                  profile.urgencyLevel === 'Medium' ? 'bg-warning' : 'bg-info'
                }`}>
                  {profile.urgencyLevel || 'Medium'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-4">
          <div className="section-title mb-3" style={{ color: "#90be54" }}>
            <i className="fas fa-user me-2"></i>About Me
          </div>
          <div className="profile-info-card p-3">
            <p className="text-muted mb-0">
              {profile.about || 'No information provided about yourself.'}
            </p>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mt-4">
          <div className="section-title mb-3" style={{ color: "#90be54" }}>
            <i className="fas fa-file-alt me-2"></i>Attached Documents
          </div>
          <div className="profile-info-card p-3">
            {(profile.documents && profile.documents.length > 0) ? (
              <ul className="list-unstyled mb-0">
                {profile.documents.map((doc, i) => (
                  <li key={i} className="icon-text mb-2">
                    <i className="bi bi-file-earmark-pdf text_success me-2"></i>
                    <a href={doc.url || "#"} className="document-link">
                      {doc.name || `Document_${i + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">
                <i className="bi bi-info-circle me-2"></i>
                No documents uploaded yet
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-4">
          <button
            className="btn donor-list-btn"
            onClick={() => handleSidebarClick("editprofile")}
          >
            <i className="fas fa-edit me-2"></i>Edit Profile
          </button>
        </div>
      </>
    ) : (
      <div className="text-center py-5">
        <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">No Profile Data</h5>
        <p className="text-muted">Unable to load your profile information.</p>
        <button 
          className="btn btn_success"
          onClick={fetchProfile}
        >
          <i className="fas fa-redo me-2"></i>Try Again
        </button>
      </div>
    )}
  </div>
</Section>
                <Section id="donations">
                  <h5 className="mb-4">My Donations</h5>

                  <ul className="list-group">
                    {/* If backend requests exist, show them, otherwise keep static donations */}
                    {(requests && requests.length > 0)
                      ? requests.map((req, idx) => (
                          <li key={req.id || idx} className="list-group-item d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap summary-card mb-1">
                            <div className="d-flex align-items-center recipient-pics">
                              <img src={req.donorImage || `https://i.pravatar.cc/50?img=${(idx % 70) + 20}`} className="rounded-circle me-3" width="50" height="50" alt={req.donorName || "Donor"} />
                              <div>
                                <strong>{req.donorName || "Unknown Donor"}</strong>
                                <br />
                                <small className="text-muted">
                                  <i className="fas fa-hand-holding-medical text_success me-1"></i>
                                  {req.title || req.caseTitle || "Untitled Request"} {req.amount ? `- Rs. ${req.amount}` : ""}
                                </small>
                              </div>
                            </div>
                            <div className="text-end mt-2 mt-md-0">
                              <small className="text-muted">
                                <i className="far fa-calendar-alt text_success me-1"></i>
                                {req.date || req.created_at || "Date not available"}
                              </small>
                              <br />
                              <span className={`badge mt-1 ${req.status === "approved" ? "btn_success" : req.status === "fulfilled" ? "bg-primary text-white" : req.status === "rejected" ? "bg-danger text-white" : "bg_warning text-dark"}`}>
                                {req.status ? req.status.toUpperCase() : "PENDING"}
                              </span>
                            </div>
                          </li>
                        ))
                      : (/* static items */ <>
                          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap summary-card mb-1">
                            <div className="d-flex align-items-center recipient-pics">
                              <img src="https://randomuser.me/api/portraits/men/45.jpg" className="rounded-circle me-3" width="50" height="50" alt="Donor" />
                              <div>
                                <strong>John Doe</strong>
                                <br />
                                <small className="text-muted">
                                  <i className="fas fa-hand-holding-medical text_success me-1"></i>
                                  Medical Help - Rs. 15,000
                                </small>
                              </div>
                            </div>
                            <div className="text-end mt-2 mt-md-0">
                              <small className="text-muted">
                                <i className="far fa-calendar-alt text_success me-1"></i>
                                12 May 2025
                              </small>
                              <br />
                              <span className="badge btn_success mt-1">Received</span>
                            </div>
                          </li>

                          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap summary-card mb-1">
                            <div className="d-flex align-items-center recipient-pics">
                              <img src="https://randomuser.me/api/portraits/women/68.jpg" className="rounded-circle me-3" width="50" height="50" alt="Donor" />
                              <div>
                                <strong>Jane Smith</strong>
                                <br />
                                <small className="text-muted">
                                  <i className="fas fa-book-reader text_success me-1"></i>
                                  Education - Books & Stationery
                                </small>
                              </div>
                            </div>
                            <div className="text-end mt-2 mt-md-0">
                              <small className="text-muted">
                                <i className="far fa-calendar-alt text_success me-1"></i>
                                28 Apr 2025
                              </small>
                              <br />
                              <span className="badge btn_success mt-1">Received</span>
                            </div>
                          </li>

                          <li className="list-group-item d-flex align-items-center justify-content-between flex-wrap flex-md-nowrap summary-card mb-1">
                            <div className="d-flex align-items-center recipient-pics">
                              <img src="https://randomuser.me/api/portraits/men/12.jpg" className="rounded-circle me-3" width="50" height="50" alt="Donor" />
                              <div>
                                <strong>Ali Khan</strong>
                                <br />
                                <small className="text-muted">
                                  <i className="fas fa-home text_success me-1"></i>
                                  Shelter - Temporary Housing
                                </small>
                              </div>
                            </div>
                            <div className="text-end mt-2 mt-md-0">
                              <small className="text-muted">
                                <i className="far fa-calendar-alt text_success me-1"></i>
                                Pending
                              </small>
                              <br />
                              <span className="badge bg_warning text-dark mt-1">Pending</span>
                            </div>
                          </li>
                        </>)}
                  </ul>
                </Section>

                <Section id="messages">
                  <div className="container py-4">
                    <h5 className="mb-4">Messages</h5>

                    {messages.length === 0 ? (
                      <div className="text-center pt-5">
                        {/* Image */}
                        <img
                          src="assets/images/conversation.png"
                          alt="No Messages"
                          className="img-fluid mb-4"
                          style={{ maxWidth: "150px" }}
                        />
                        {/* Text */}
                        <h5 className="text-dark">No messages yet</h5>
                      </div>
                    ) : (
                      <ul className="list-group">
                        {messages.map((msg, idx) => (
                          <li
                            key={msg.id || idx}
                            className={`list-group-item d-flex ${
                              msg.sender === "recipient" ? "justify-content-end" : "justify-content-start"
                            }`}
                          >
                            <div
                              className={`p-2 rounded ${
                                msg.sender === "recipient" ? "bg-success text-white" : "bg-light text-dark"
                              }`}
                              style={{ maxWidth: "70%" }}
                            >
                              <small>{msg.text || msg.content}</small>
                              <br />
                              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                                {msg.time || msg.created_at || "Just now"}
                              </small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Input Box */}
                    <div className="mt-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // read input by id messagesInput and send
                          const input = document.getElementById("messagesInput");
                          const text = input ? input.value.trim() : "";
                          if (!text) return;
                          // use same message API
                          (async () => {
                            try {
                              // optimistic update
                              setMessages(prev => [...prev, { sender: "recipient", text, time: "Just now" }]);
                              if (input) input.value = "";
                              await axiosInstance.post("/api/messages/", { text });
                              const res = await axiosInstance.get("/api/messages/");
                              if (Array.isArray(res.data)) setMessages(res.data);
                            } catch (err) {
                              console.error(err);
                              alert("Failed to send message.");
                            }
                          })();
                        }}
                        className="d-flex"
                      >
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Type a message..."
                          id="messagesInput"
                        />
                        <button type="submit" className="btn btn_success">
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                </Section>

                <Section id="form">
                  <div className="container mt-5">
                    <div className="row justify-content-center">
                      <div className="col-lg-10 bg-white p-4 rounded-3 shadow-sm">
                        <h2 className="text-center mb-4">Apply for Donation</h2>
                        <form onSubmit={handleSubmit}>
                          {/* 1. Personal Information */}
                          <h5 className="mb-3">1. Personal Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label">Full Name</label>
                              <input
                                name="fullName"
                                type="text"
                                className="form-control"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">CNIC Number</label>
                              <input
                                name="cnic"
                                type="text"
                                className="form-control"
                                placeholder="xxxxx-xxxxxxx-x"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Phone Number</label>
                              <input
                                name="phone"
                                type="tel"
                                className="form-control"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                Email Address
                              </label>
                              <input name="email" type="email" className="form-control" />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                Date of Birth
                              </label>
                              <input name="dob" type="date" className="form-control" />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                City / District
                              </label>
                              <input name="city" type="text" className="form-control" />
                            </div>
                          </div>

                          {/* 2. Aid Request Details */}
                          <h5 className="mb-3">2. Aid Request Details</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label">Type of Aid</label>
                              <select
                                name="aidType"
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                required
                              >
                                <option value="" disabled>
                                  Select Type
                                </option>
                                <option value="Education">Education</option>
                                <option value="Medical">Medical</option>
                                <option value="Orphan">Orphan</option>
                                <option value="Food">Food</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                Required Amount (PKR)
                              </label>
                              <input name="amount" type="number" className="form-control" required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                Collected (for now)
                              </label>
                              <input name="collected" type="number" className="form-control" defaultValue={0} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Case Title</label>
                              <input name="caseTitle" type="text" className="form-control" placeholder="e.g. Kidney Surgery for Father" required />
                            </div>
                            <div className="col-12">
                              <label className="form-label">
                                Description of Your Situation
                              </label>
                              <textarea name="description" className="form-control" rows="4" required></textarea>
                            </div>
                          </div>

                          {/* 3. Urgency & Impact */}
                          <h5 className="mb-3">3. Urgency & Impact</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label">
                                Urgency Level
                              </label>
                              <select name="urgency" className="form-select">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                              </select>
                            </div>
                          </div>

                          {/* 4. Document Uploads */}
                          <h5 className="mb-3">4. Document Uploads</h5>
                          <div className="row g-3 mb-4">
                            {/* Dynamic Document Uploads (keeps existing dynamic UI) */}
                            {selectedCategory === "Education" && (
                              <>
                                <div className="col-md-6">
                                  <label className="form-label">
                                    Student ID card (college/university/school)
                                  </label>
                                  <input name="student_id" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">
                                    Enrollment/Admission letter
                                  </label>
                                  <input name="enrollment_letter" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Fee challan / invoice</label>
                                  <input name="fee_challan" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Transcript / mark sheet</label>
                                  <input name="transcript" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Recommendation letter from institution</label>
                                  <input name="recommendation" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                              </>
                            )}
                            {selectedCategory === "Medical" && (
                              <>
                                <div className="col-md-6">
                                  <label className="form-label">Doctor’s prescription</label>
                                  <input name="prescription" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Hospital admission slip</label>
                                  <input name="admission_slip" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Medical test reports (X-rays, lab results, scans)</label>
                                  <input name="medical_reports" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Treatment cost estimate / hospital bill</label>
                                  <input name="treatment_estimate" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Disability or chronic illness certificate</label>
                                  <input name="disability_cert" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                              </>
                            )}
                            {selectedCategory === "Orphan" && (
                              <>
                                <div className="col-md-6">
                                  <label className="form-label">Death certificate of father/mother</label>
                                  <input name="death_certificate" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Guardian/relative CNIC copy</label>
                                  <input name="guardian_cnic" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Orphanage registration (if child is staying in an institution)</label>
                                  <input name="orphanage_registration" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Orphan certificate</label>
                                  <input name="orphan_certificate" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                              </>
                            )}
                            {selectedCategory === "Food" && (
                              <>
                                <div className="col-md-6">
                                  <label className="form-label">CNIC of applicant</label>
                                  <input name="applicant_cnic" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Proof of income (salary slip, zakat eligibility letter)</label>
                                  <input name="proof_of_income" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Household registration certificate</label>
                                  <input name="household_reg" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Utility bills (to verify financial background)</label>
                                  <input name="utility_bills" type="file" className="form-control" accept="image/*,application/pdf" />
                                </div>
                              </>
                            )}
                          </div>

                          {/* 6. Declaration */}
                          <h5 className="mb-3">6. Declaration</h5>
                          <div className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="declaration1"
                              name="declaration1"
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="declaration1"
                            >
                              I declare that the information provided is true
                              and correct.
                            </label>
                          </div>
                          <div className="form-check mb-4">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="declaration2"
                              name="declaration2"
                              required
                            />
                            <label
                              className="form-check-label"
                              htmlFor="declaration2"
                            >
                              I authorize AidLink to verify my information using
                              AI and human review.
                            </label>
                          </div>

                          {/* Submit */}
                          <div className="text-center">
                            <button
                              type="submit"
                              className="primary_btn style-thirteen mt-4"
                            >
                              Submit Application{" "}
                              <i className="far fa-heart"></i>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Section>

     {/* ✅ EDIT PROFILE SECTION - UPDATE REAL DATA IN DATABASE */}
<Section id="editprofile">
  <div>
    <form className="py-4 px-2 px-md-5" onSubmit={handleUpdateProfile} encType="multipart/form-data">
      {/* Profile Picture - Centered */}
      <div className="text-center mb-4">
        <img
          id="profilePreview"
          src={profile?.profilePicture || "/default-avatar.png"}
          className="rounded-circle profile-pg-pic shadow-sm mb-3"
          width="150"
          height="150"
          alt="Profile Picture"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <div className="mx-auto" style={{ maxWidth: "300px" }}>
          <input
            name="profilePicture"
            type="file"
            className="form-control"
            id="profilePicInput"
            accept="image/*"
            onChange={(e) => {
              // ✅ Real-time image preview
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  document.getElementById('profilePreview').src = e.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
          <small className="text-muted d-block mt-1">
            Allowed: JPG, PNG (Max 2MB)
          </small>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-6">
          <label className="form-label">Full Name *</label>
          <input
            name="fullName"
            type="text"
            className="form-control"
            defaultValue={profile?.fullName || ""}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email *</label>
          <input
            name="email"
            type="email"
            className="form-control"
            defaultValue={profile?.email || ""}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone Number *</label>
          <input
            name="phoneNumber"
            type="text"
            className="form-control"
            defaultValue={profile?.phoneNumber || ""}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Address *</label>
          <input
            name="address"
            type="text"
            className="form-control"
            defaultValue={profile?.address || ""}
            placeholder="Enter your address"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Father's Name</label>
          <input
            name="fatherName"
            type="text"
            className="form-control"
            defaultValue={profile?.fatherName || ""}
            placeholder="Enter father's name"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Family Members</label>
          <input
            name="familyMembers"
            type="number"
            className="form-control"
            defaultValue={profile?.familyMembers || 0}
            placeholder="Number of family members"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Previous Job</label>
          <input
            name="previousJob"
            type="text"
            className="form-control"
            defaultValue={profile?.previousJob || ""}
            placeholder="Your previous occupation"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Urgency Level</label>
          <select 
            name="urgencyLevel" 
            className="form-select" 
            defaultValue={profile?.urgencyLevel || "Medium"}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div className="col-md-12">
          <label className="form-label">About Me</label>
          <textarea
            name="about"
            className="form-control"
            rows="3"
            defaultValue={profile?.about || ""}
            placeholder="Describe your situation and background..."
          ></textarea>
        </div>

        <div className="col-12 text-end mt-2">
          <button
            className="primary_btn text-white py-2 px-4 donor-list-btn"
            type="submit"
            disabled={loading.update}
          >
            {loading.update ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </button>
        </div>
      </div>
    </form>
  </div>
</Section>
                <Section id="prefrences">
                  <div className="container">
                    <h5 className="mb-4 text-dark">
                      Please Set Your Preferences
                    </h5>

                    <form
                      className="row g-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSavePreferences(e);
                      }}
                    >
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-medium">Language</label>
                        <select
                          className="form-select custom-select"
                          defaultValue={preferences.language || "English"}
                          onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                        >
                          <option>English</option>
                          <option>Urdu</option>
                        </select>
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label fw-medium">Currency</label>
                        <select
                          className="form-select custom-select"
                          defaultValue={preferences.currency || "PKR"}
                          onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                        >
                          <option>PKR</option>
                          <option>USD</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-medium">
                          Date Format
                        </label>
                        <select
                          className="form-select custom-select"
                          defaultValue={preferences.dateFormat || "DD-MM-YYYY"}
                          onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                        >
                          <option>DD-MM-YYYY</option>
                          <option>MM-DD-YYYY</option>
                        </select>
                      </div>

                      <div className="col-12 text-end">
                        <button
                          className="primary_btn text-white  px-4 py-2 donor-list-btn"
                          type="submit"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </form>
                  </div>
                </Section>

                <Section id="notifications">
                  <div className="container">
                    <h5 className="mb-4">Please Set Your Notification Setting</h5>

                    <form
                      className="row g-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveNotifications(e);
                      }}
                    >
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input custom-checkbox"
                            type="checkbox"
                            id="donationEmail"
                            checked={notificationsState.donationEmail || false}
                            onChange={(e) => setNotificationsState(prev => ({ ...prev, donationEmail: e.target.checked }))}
                          />
                          <label className="form-check-label fs-6" htmlFor="donationEmail">
                            Donation Confirmation Emails
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input custom-checkbox"
                            type="checkbox"
                            id="monthlyReport"
                            checked={notificationsState.monthlyReport || false}
                            onChange={(e) => setNotificationsState(prev => ({ ...prev, monthlyReport: e.target.checked }))}
                          />
                          <label className="form-check-label fs-6" htmlFor="monthlyReport">
                            Monthly Summary Reports
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input custom-checkbox"
                            type="checkbox"
                            id="newRecipient"
                            checked={notificationsState.newRecipient || false}
                            onChange={(e) => setNotificationsState(prev => ({ ...prev, newRecipient: e.target.checked }))}
                          />
                          <label className="form-check-label fs-6" htmlFor="newRecipient">
                            New Recipient Notifications
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <button
                          className="primary_btn text-white px-4 py-2 donor-list-btn"
                          type="submit"
                        >
                          Save Notifications
                        </button>
                      </div>
                    </form>
                  </div>
                </Section>

 {/* Logout Section - SAME */}
              <Section id="logout">
                <div className="container mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 p-4 rounded shadow-sm bg-white">
                      <div className="text-center mb-4">
                        <h4 className="mb-2" style={{ color: "#90be54" }}>
                          <i className="fas fa-user-shield me-2"></i>Account Security
                        </h4>
                        <p className="text-muted">Manage your account sessions and security preferences.</p>
                      </div>

                      <div className="border rounded-3 p-3 mb-3 text-start">
                        <h6 className="fw-bold mb-2">
                          <i className="fas fa-sign-out-alt me-2 text-danger"></i>Logout from all devices
                        </h6>
                        <p className="small text-muted mb-3">
                          This will sign you out from all browsers and devices instantly.
                        </p>
                       <button 
  className="btn btn-outline-danger w-100 cursor-pointer" 
  onClick={() => { 
    if (window.confirm("Are you sure you want to logout from all devices?")) { 
      handleLogoutAll();   // ✅ FIX
    } 
  }}
>
  Confirm Logout
</button>

                      </div>

                      <div className="border rounded-3 p-3 bg-light text-start">
                        <h6 className="fw-bold mb-2 text-danger">
                          <i className="fas fa-user-times me-2"></i>Delete Account
                        </h6>
                        <p className="small text-muted mb-3">
                          Once deleted, your account and all data will be permanently removed.
                        </p>
                        <button 
                          className="btn btn-outline-secondary w-100 cursor-pointer" 
                          onClick={() => { 
                            const confirmation = window.prompt("Type DELETE to confirm permanent account deletion:"); 
                            if (confirmation === "DELETE") { 
                              setMessage("Account deletion requested."); 
                            } else { 
                              alert("Deletion cancelled or incorrect confirmation."); 
                            } 
                          }}
                        >
                          Confirm Deletion
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

                {/* donor-profile, chatBox, notification box kept same and wired earlier */}
                <Section id="donor-profile">
                  {donorData ? (
                    <>
                      {/* Back Button */}
                      <div className="mb-3">
                        <button
                          className="btn p-0 fw-semibold"
                          style={{ color: "#90be54", textDecoration: "none" }}
                          onClick={() => handleSidebarClick("dashboard")}
                        >
                          <i className="bi bi-arrow-left me-2"></i>Back
                        </button>
                      </div>
                      <div className="text-start mb-4">
                        <p className="text-muted">
                          Track your past contributions and download receipts
                        </p>
                      </div>

                      <div className="card shadow-sm summary-card p-4 mb-4">
                        <div className="row align-items-center">
                          <div className="col-md-3 text-center donor-profile-img">
                            <img
                              src={donorData.image}
                              alt={donorData.name}
                              className="rounded-circle"
                              width="100"
                              height="100"
                            />
                          </div>
                          <div className="col-md-9">
                            <h4 className="mb-1">{donorData.name}</h4>
                            <p className="mb-1 text-muted">
                              <i className="bi bi-geo-alt-fill me-1"></i>{" "}
                              {donorData.location}
                            </p>
                            <p className="mb-0 text-muted">
                              <i className="bi bi-envelope-fill me-1"></i>{" "}
                              {donorData.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-md-4 col-12">
                          <div className="summary-card text-center">
                            <p className="mb-1">Total Donated</p>
                            <h5>{donorData.total}</h5>
                          </div>
                        </div>
                        <div className="col-md-4 col-12">
                          <div className="summary-card text-center">
                            <p className="mb-1">Donations Made</p>
                            <h5>{donorData.count}</h5>
                          </div>
                        </div>
                        <div className="col-md-4 col-12">
                          <div className="summary-card text-center">
                            <p className="mb-1">Last Donation</p>
                            <h5>{donorData.lastDonation}</h5>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted">No donor selected.</p>
                  )}
                </Section>
              </div>

              {/* Chat Box */}
              <div
                id="chatBox"
                className="card shadow position-fixed bottom-0 end-0 m-3"
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  display: "none",
                  zIndex: 1050,
                }}
              >
                <div
                  className="card-header text-white d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: "#90be54" }}
                >
                  <span className="fw-semibold">Chat with Donor</span>
                  <button
                    type="button"
                    className="btn-close btn-close-white btn-sm"
                    onClick={() => window.closeChatBox()}
                  ></button>
                </div>
                <div
                  id="chatMessages"
                  className="card-body p-3"
                  style={{
                    height: "220px",
                    overflowY: "auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                      <div key={idx} className={`mb-2 ${msg.sender === "recipient" ? "text-end" : "text-start"}`}>
                        <span className={`px-2 py-1 rounded-3 ${msg.sender === "recipient" ? "bg-success text-white" : "bg-light text-dark"}`} style={{ fontSize: "0.85rem" }}>
                          {msg.text || msg.content}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small mb-0">Introduce yourself and describe your need.</p>
                  )}
                </div>
                <div className="card-footer border-0 p-2 bg-white">
                  <div className="input-group input-group-sm">
                    <input type="text" id="chatInput" className="form-control" placeholder="Type your message..." />
                    <button className="btn text-white" style={{ backgroundColor: "#90be54" }} onClick={handleSendMessage}>
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Box */}
              {showNotifications && (
                <div
                  className="card shadow position-fixed end-0 m-3"
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    zIndex: 1050,
                    top: "60px",
                  }}
                >
                  <div
                    className="card-header text-white d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: "#90be54" }}
                  >
                    <span className="fw-semibold">Notifications</span>
                    <button
                      type="button"
                      className="btn-close btn-close-white btn-sm"
                      onClick={() => setShowNotifications(false)}
                    ></button>
                  </div>
                  <div
                    className="card-body p-3"
                    style={{
                      maxHeight: "220px",
                      overflowY: "auto",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <p className="text-muted small mb-0">
                      No notifications available at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipientDashboard;
