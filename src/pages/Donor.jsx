import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../dashboards css/dashboards.css";

const API_URL = "http://127.0.0.1:8000/api/";

// API endpoints - UPDATED
const API_ENDPOINTS = {
  RECIPIENTS: "recipients/",
  DONATIONS: "donations/",
  PROFILE: "donor/profile/", // ✅ CHANGED to donor profile
  UPDATE_PROFILE: "donor/profile/", // ✅ CHANGED to donor profile
  NOTIFICATIONS: "notifications/",
  PREFERENCES: "preferences/",
  ROLE_CHANGE: "role-change/",
  UPLOAD_IMAGE: "upload-image/",
};

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("recipients");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [daysFilter, setDaysFilter] = useState("7");
  const [searchText, setSearchText] = useState("");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("Completed");

  // Data states - AB REAL DATA KE LIYE
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [formData, setFormData] = useState({ amount: "", description: "" });
  const [profile, setProfile] = useState({
    phone: "",
    address: "",
    full_name: "",
    email: "",
    location: "",
    bio: "",
    profile_picture: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState({
    recipients: false,
    donations: false,
    profile: false,
    update: false,
  });

  // For avoiding repeated refresh attempts
  const isRefreshingRef = useRef(false);
  const failedQueueRef = useRef([]);

  // ✅ AXIOS INSTANCE & INTERCEPTORS
  const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
  });

  // For Matches Section
  const handleSavePreferences = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const selectedCategories = form.getAll("categories");
    const budget = form.get("budget");
    const keywords = form.get("keywords");

    // Save to backend or local state
    console.log("Preferences saved:", {
      categories: selectedCategories,
      budget,
      keywords,
    });

    setMessage("Preferences saved successfully!");
  };

  // Request interceptor: attach access token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // For file uploads, don't set Content-Type
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: try refresh on 401
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      if (!originalRequest) return Promise.reject(err);

      if (
        err.response &&
        err.response.status === 401 &&
        !originalRequest._retry
      ) {
        if (isRefreshingRef.current) {
          return new Promise(function (resolve, reject) {
            failedQueueRef.current.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              return axios(originalRequest);
            })
            .catch((e) => Promise.reject(e));
        }

        originalRequest._retry = true;
        isRefreshingRef.current = true;

        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) {
          isRefreshingRef.current = false;
          processQueue(new Error("No refresh token"));
          handleLogoutLocal();
          return Promise.reject(err);
        }

        try {
          const response = await axios.post(`${API_URL}token/refresh/`, {
            refresh: refresh,
          });
          const newAccess = response.data.access;
          localStorage.setItem("access_token", newAccess);
          api.defaults.headers.common["Authorization"] = "Bearer " + newAccess;
          processQueue(null, newAccess);
          isRefreshingRef.current = false;
          originalRequest.headers.Authorization = "Bearer " + newAccess;
          return axios(originalRequest);
        } catch (refreshError) {
          isRefreshingRef.current = false;
          processQueue(refreshError, null);
          handleLogoutLocal();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(err);
    }
  );

  const processQueue = (error, token = null) => {
    failedQueueRef.current.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueueRef.current = [];
  };

  // ✅ FIXED AUTHENTICATION CHECK
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      console.log("🔐 Donor Auth Check - Token:", token ? "Exists" : "Missing");
      console.log("🔐 Donor Auth Check - User:", userData);

      if (!token || !userData) {
        console.log("❌ No auth token, redirecting to login");
        localStorage.clear();
        navigate("/login");
        return false;
      }

      try {
        const userObj = JSON.parse(userData);

        if (userObj.role !== "donor") {
          console.log("❌ Wrong role, redirecting to login");
          localStorage.clear();
          navigate("/login");
          return false;
        }

        setUser(userObj);
        console.log("✅ Donor auth successful, user:", userObj);
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
      // fetch ALL initial data
      fetchRecipients();
      fetchDonations();
      fetchProfile();
      fetchNotifications();
      fetchPreferences();

      // responsive sidebar logic
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        if (window.innerWidth >= 768) setIsSidebarVisible(true);
        else setIsSidebarVisible(false);
      };

      window.addEventListener("resize", handleResize);
      window.openChatBox = () => {
        const cb = document.getElementById("chatBox");
        if (cb) cb.style.display = "block";
      };
      window.closeChatBox = () => {
        const cb = document.getElementById("chatBox");
        if (cb) cb.style.display = "none";
      };

      return () => {
        window.removeEventListener("resize", handleResize);
        delete window.openChatBox;
        delete window.closeChatBox;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // ------------------ API FUNCTIONS ------------------

  // ✅ REAL RECIPIENTS DATA FETCH - UPDATED
  const fetchRecipients = async () => {
    setLoading((prev) => ({ ...prev, recipients: true }));
    try {
      const res = await api.get(API_ENDPOINTS.RECIPIENTS);
      // Backend se real data aayega
      setRecipients(Array.isArray(res.data) ? res.data : []);
      console.log("✅ Recipients loaded:", res.data.length);
    } catch (err) {
      console.error("fetchRecipients error:", err);
      setMessage("Unable to load recipients. Please try again later.");
    } finally {
      setLoading((prev) => ({ ...prev, recipients: false }));
    }
  };

  // ✅ REAL DONATIONS DATA FETCH
  const fetchDonations = async () => {
    setLoading((prev) => ({ ...prev, donations: true }));
    try {
      const res = await api.get(API_ENDPOINTS.DONATIONS);
      setDonations(Array.isArray(res.data) ? res.data : []);
      console.log("✅ Donations loaded:", res.data.length);
    } catch (err) {
      console.error("fetchDonations error:", err);
      setMessage("Unable to load donation history. Please try again later.");
    } finally {
      setLoading((prev) => ({ ...prev, donations: false }));
    }
  };

  // ✅ REAL PROFILE DATA FETCH - UPDATED
  const fetchProfile = async () => {
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const res = await api.get(API_ENDPOINTS.PROFILE);
      console.log("✅ Profile data received:", res.data);
      setProfile(
        res.data || {
          phone: "",
          address: "",
          full_name: user?.username || "",
          email: user?.email || "",
          location: "",
          bio: "",
        }
      );
    } catch (err) {
      console.error("fetchProfile error:", err);
      setMessage("Unable to load profile.");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // ✅ REAL NOTIFICATIONS DATA FETCH
  const fetchNotifications = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.NOTIFICATIONS);
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchNotifications error:", err);
    }
  };

  // ✅ REAL PREFERENCES DATA FETCH
  const fetchPreferences = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.PREFERENCES);
      setPreferences(res.data || {});
    } catch (err) {
      console.error("fetchPreferences error:", err);
    }
  };

  // ✅ REAL PROFILE UPDATE - UPDATED
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, update: true }));

    try {
      const formData = new FormData();

      // Add all profile fields to form data
      formData.append("name", profile.full_name || "");
      formData.append("phone", profile.phone || "");
      formData.append("address", profile.address || "");
      formData.append("bio", profile.bio || "");

      // Add profile picture if selected
      if (profile.profile_picture_file) {
        formData.append("profile_picture", profile.profile_picture_file);
      }

      const res = await api.put(API_ENDPOINTS.UPDATE_PROFILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data);
      setMessage("✅ Profile updated successfully!");

      // Update stored user data if needed
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored) {
        const newStored = {
          ...stored,
          username: profile.full_name || stored.username,
          email: profile.email || stored.email,
        };
        localStorage.setItem("user", JSON.stringify(newStored));
        setUser(newStored);
      }
    } catch (err) {
      console.error("handleProfileUpdate error:", err);
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Error updating profile.";
      setMessage("❌ " + errMsg);
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  // ✅ REAL PROFILE IMAGE UPLOAD - UPDATED
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage("❌ File size too large. Maximum 2MB allowed.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setMessage("❌ Please select a valid image file (JPG, PNG).");
      return;
    }

    // Update profile picture preview
    const img = document.getElementById("profilePreview");
    if (img) {
      img.src = URL.createObjectURL(file);
    }

    // Store file for upload
    setProfile((prev) => ({
      ...prev,
      profile_picture: URL.createObjectURL(file),
      profile_picture_file: file,
    }));

    setMessage("🔄 Profile picture selected. Click 'Update Profile' to save.");
  };

  // ✅ REAL DONATION SUBMIT
  const handleDonate = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    try {
      await api.post(API_ENDPOINTS.DONATIONS, {
        ...formData,
        recipient_id: selectedProfile?.id,
      });
      setMessage("✅ Donation submitted successfully!");
      setFormData({ amount: "", description: "" });
      fetchDonations();
    } catch (err) {
      console.error("handleDonate error:", err);
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Error submitting donation.";
      setMessage("❌ " + errMsg);
    }
  };

  // ✅ REAL PREFERENCES UPDATE
  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(API_ENDPOINTS.PREFERENCES, preferences);
      setMessage("✅ Preferences updated successfully!");
    } catch (err) {
      console.error("handlePreferencesUpdate error:", err);
      setMessage("❌ Error updating preferences.");
    }
  };

  // ✅ REAL NOTIFICATIONS UPDATE
  const handleNotificationsUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(API_ENDPOINTS.NOTIFICATIONS, {
        donation_email: document.getElementById("donationEmail").checked,
        monthly_report: document.getElementById("monthlyReport").checked,
        new_recipient: document.getElementById("newRecipient").checked,
      });
      setMessage("✅ Notification settings updated!");
    } catch (err) {
      console.error("handleNotificationsUpdate error:", err);
      setMessage("❌ Error updating notifications.");
    }
  };

  // ✅ REAL ROLE CHANGE REQUEST
  const handleRoleChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await api.post(API_ENDPOINTS.ROLE_CHANGE, {
        username: formData.get("username"),
        cnic: formData.get("cnic"),
        reason: formData.get("reason"),
      });
      setMessage("✅ Role change request submitted for admin review.");
      e.target.reset();
    } catch (err) {
      console.error("handleRoleChange error:", err);
      setMessage("❌ Error submitting role change request.");
    }
  };

  // ------------------ FILTER LOGIC FOR REAL RECIPIENTS ------------------
  const filteredRecipients = recipients.filter((recipient) => {
    const matchesCategory = categoryFilter
      ? recipient.category === categoryFilter
      : true;
    const matchesUrgency = urgencyFilter
      ? recipient.urgency === urgencyFilter
      : true;
    const matchesSearch = searchText
      ? recipient.name.toLowerCase().includes(searchText.toLowerCase()) ||
        recipient.reason.toLowerCase().includes(searchText.toLowerCase())
      : true;

    return matchesCategory && matchesUrgency && matchesSearch;
  });

  // ------------------ UI Handlers ------------------
  const handleSidebarClick = (sectionId) => {
    setActiveSection(sectionId);
    if (window.innerWidth < 768) setIsSidebarVisible(false);
  };

  const handleLogoutLocal = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Keep original markup/styling exactly same as you provided
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

  // ✅ CALCULATE SUMMARY STATISTICS FROM REAL DATA
  const totalDonated = donations.reduce(
    (sum, donation) => sum + (donation.amount || 0),
    0
  );
  const donationsCount = donations.length;
  const lastDonation =
    donations.length > 0
      ? new Date(donations[0].date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "No donations yet";

  const AidLinkChatUI = ({ apiUrl, themeColor = "#90be54" }) => {
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "bot",
      text: "Hi! I’m AidLink support. How can I help?",
      source: "system",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isSending]);

  const canSend = input.trim().length > 0 && !isSending;

  const sourceLabel = (src) => {
    if (src === "dataset") return "Source: Dataset";
    if (src === "llm") return "Source: AI";
    if (src === "error") return "Source: Error";
    return "";
  };

  const send = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setError("");
    setIsSending(true);

    const userMsg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const typingId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: typingId, role: "bot", text: "Typing...", source: "typing" },
    ]);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = String(data.answer || "Sorry, I could not generate a reply.").trim();
      const src = data.source || "llm";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId ? { ...m, text: reply, source: src } : m
        )
      );
    } catch (e) {
      setError("Server not reachable. Make sure your API is running on port 8000.");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                text: "Sorry, I could not reach the server. Please try again.",
                source: "error",
              }
            : m
        )
      );
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) send();
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: themeColor,
              boxShadow: `0 0 0 3px ${themeColor}2A`,
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
              AidLink Support
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Ask anything about AidLink
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: crypto.randomUUID(),
                role: "bot",
                text: "Hi! I’m AidLink support. How can I help?",
                source: "system",
              },
            ])
          }
          style={{
            border: `1px solid ${themeColor}`,
            color: themeColor,
            background: "transparent",
            padding: "8px 10px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
          title="Reset chat"
        >
          Reset
        </button>
      </div>

      {/* Error bar */}
      {error ? (
        <div
          style={{
            padding: "10px 12px",
            background: "rgba(239,68,68,0.08)",
            color: "#991b1b",
            fontSize: 12,
            borderBottom: "1px solid rgba(239,68,68,0.18)",
          }}
        >
          {error}
        </div>
      ) : null}

      {/* Messages */}
      <div
        ref={listRef}
        style={{
          height: 460,
          overflowY: "auto",
          padding: 14,
          background: "#ffffff",
        }}
      >
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div key={m.id} style={{ display: "flex", marginBottom: 10 }}>
              <div
                style={{
                  maxWidth: "78%",
                  marginLeft: isUser ? "auto" : 0,
                  marginRight: isUser ? 0 : "auto",
                  padding: "10px 12px",
                  borderRadius: 14,
                  fontSize: 14,
                  lineHeight: 1.35,
                  whiteSpace: "pre-wrap",
                  background: isUser ? "#111827" : "#f3f4f6",
                  color: isUser ? "#fff" : "#111827",
                  border: isUser ? "1px solid transparent" : "1px solid #e5e7eb",
                }}
              >
                {m.text}
                {(() => {
                  const label = sourceLabel(m.source);
                  return label ? (
                    <div style={{ marginTop: 6, fontSize: 11, opacity: 0.75 }}>
                      {label}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid #e5e7eb",
          background: "#fafafa",
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          disabled={isSending}
          style={{
            flex: 1,
            resize: "none",
            padding: "10px 12px",
            borderRadius: 12,
            border: `1px solid ${themeColor}33`,
            outline: "none",
            fontSize: 14,
            minHeight: 44,
            maxHeight: 120,
          }}
        />

        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid transparent",
            background: canSend ? themeColor : "#9ca3af",
            color: "#fff",
            fontWeight: 700,
            cursor: canSend ? "pointer" : "not-allowed",
            minWidth: 86,
          }}
        >
          {isSending ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
};


  return (
    <div className="page-wrapper">
      <div className="container-fluid g-0">
        <div className="d-flex flex-row">
          {/* Sidebar - SAME AS BEFORE */}
          <div
            id="sidebarMenu"
            className={`sidebar-container col-md-2 sidebar ps-2 pe-2 ${
              isSidebarVisible ? "d-block" : "d-none"
            }`}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              zIndex: 1050,
              overflowY: "auto",
              width: window.innerWidth >= 768 ? "16.6667%" : "50%",
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
                isSidebarVisible || window.innerWidth >= 768 ? "block" : "none",
            }}
          >
            <button className="sidebar-link mb-2" onClick={() => navigate("/")}>
              <i className="fas fa-chevron-left me-2"></i>{" "}
              <strong>Back to Home</strong>
            </button>
            <button
              className={`sidebar-link mb-1 ${
                activeSection === "recipients" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("recipients")}
            >
              <i className="fas fa-users me-2"></i>Browse Recipients
            </button>
            <button
              className={`sidebar-link mb-1 ${
                activeSection === "my-profile" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("my-profile")}
            >
              <i className="fas fa-user me-2"></i>My Profile
            </button>
            <button
              className={`sidebar-link mb-1 ${
                activeSection === "donations" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("donations")}
            >
              <i className="fas fa-hand-holding-heart me-2"></i>My Donations
            </button>

            <button
              className={`sidebar-link mb-1 ${
                activeSection === "editprofile" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("editprofile")}
            >
              <i className="fas fa-user-edit me-2"></i>Edit Profile
            </button>


            <button
              className={`sidebar-link mb-1 ${
                activeSection === "messages" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("messages")}
            >
              <i className="fas fa-inbox me-2"></i>AidLink Support
            </button>
            
                <button
              className={`sidebar-link mb-1 ${
                activeSection === "matches" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("matches")}
            >
              <i className="fa-solid fa-heart-circle-check me-2"></i> Matches
            </button> 

            <button
              className={`sidebar-link mb-1 ${
                activeSection === "prefrences" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("prefrences")}
            >
              <i className="fas fa-tools me-2"></i>Preferences
            </button>
            <button
              className={`sidebar-link mb-1 ${
                activeSection === "notifications" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("notifications")}
            >
              <i className="fas fa-bell me-2"></i>Notifications
            </button>

            <button
              className={`sidebar-link mb-1 ${
                activeSection === "logout" ? "active" : ""
              }`}
              onClick={() => handleSidebarClick("logout")}
            >
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
            <div className="topbar d-flex justify-content-between align-items-center p-3">
              <h5 className="ms-2" style={{ color: "#90be54" }}>
                <i className="fas fa-home me-2"></i>
                Donor Dashboard
              </h5>
              <div>
                <button
                  className="btn icon-btn me-2"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                >
                  <i className="fas fa-bell"></i>
                  {notifications.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <img
                  src={
                    profile.profile_picture ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
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

            {/* Message Display */}
            {message && (
              <div
                className={`alert ${
                  message.includes("❌") ? "alert-danger" : "alert-success"
                } mx-3 mt-2`}
              >
                {message}
              </div>
            )}

            <div className="content">
              {/* Recipients Section - NOW WITH REAL DATA */}
              <Section id="recipients">
                <div className="row mb-4 g-3">
                  <div className="col-12 col-sm-6">
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control cursor-text"
                        placeholder="Search by name or keyword"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        autoFocus
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-2">
                    <select
                      className="form-select cursor-pointer"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="Medical">Medical</option>
                      <option value="Education">Education</option>
                      <option value="Food">Food</option>
                      <option value="Shelter">Shelter</option>
                      <option value="Orphans">Orphans</option>
                    </select>
                  </div>
                  <div className="col-12 col-sm-2">
                    <select
                      className="form-select cursor-pointer"
                      value={urgencyFilter}
                      onChange={(e) => setUrgencyFilter(e.target.value)}
                    >
                      <option value="">All Urgency</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Regular">Regular</option>
                    </select>
                  </div>
                  <div className="col-12 col-sm-2">
                    <select
                      className="form-select cursor-pointer"
                      value={daysFilter}
                      onChange={(e) => setDaysFilter(e.target.value)}
                    >
                      <option value="7">Last 7 Days</option>
                      <option value="14">Last 14 Days</option>
                      <option value="30">Last 30 Days</option>
                    </select>
                  </div>
                </div>

                {/* Recipient Cards - REAL DATA */}
                {loading.recipients ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading recipients...</p>
                  </div>
                ) : (
                  <div className="row g-4 mb-4">
                    {filteredRecipients.map((recipient, idx) => (
                      <div
                        key={recipient.id || idx}
                        className="col-12 col-lg-6"
                      >
                        <div className="card recipient-card shadow-sm h-100 border-0 p-3 d-flex flex-column bg-light">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  recipient.image ||
                                  "https://randomuser.me/api/portraits/lego/1.jpg"
                                }
                                className="rounded-circle me-3"
                                width="70"
                                height="70"
                                alt={recipient.name}
                              />
                              <div>
                                <h5 className="mb-1 fw-semibold">
                                  {recipient.name}
                                </h5>
                                <p
                                  className="mb-0 small"
                                  style={{ color: "#388e3c" }}
                                >
                                  {recipient.created_at
                                    ? new Date(
                                        recipient.created_at
                                      ).toLocaleDateString()
                                    : "Recently"}
                                </p>
                                <p
                                  className="mb-1 small text-muted"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {recipient.reason || recipient.description}
                                </p>
                                <p className="mb-0 small text-muted">
                                  <i
                                    className="bi bi-geo-alt-fill me-1"
                                    style={{ color: "#90be54" }}
                                  ></i>
                                  {recipient.location}
                                </p>
                              </div>
                            </div>
                            <div className="text-end">
                              <span
                                className="badge mb-1"
                                style={{
                                  backgroundColor:
                                    recipient.urgency?.toLowerCase() ===
                                    "urgent"
                                      ? "#ff0000"
                                      : "#90be54",
                                  padding: "6px 13px",
                                  color: "#fff",
                                }}
                              >
                                {recipient.urgency || "Regular"}
                              </span>
                            </div>
                          </div>
                          <p className="fw-bold text_success mb-1">
                            PKR{" "}
                            {recipient.donated_amount?.toLocaleString() || 0} of
                            PKR{" "}
                            {recipient.required_amount?.toLocaleString() || 0}
                          </p>
                          <div
                            className="progress mb-2"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar bg_success"
                              style={{
                                width: `${
                                  recipient.required_amount
                                    ? Math.min(
                                        100,
                                        (recipient.donated_amount /
                                          recipient.required_amount) *
                                          100
                                      )
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="badge bg2_success bg-opacity-10 text2_success mb-3 px-3 py-1">
                            {recipient.category || "General"}
                          </span>
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <div className="d-flex gap-2">
                              <button
                                className="btn icon-btn cursor-pointer"
                                onClick={() => window.openChatBox()}
                                title="Inbox"
                              >
                                <i className="bi bi-envelope-fill"></i>
                              </button>
                              <Link
                                to="/donate"
                                className="btn icon-btn cursor-pointer"
                                title="Donate"
                              >
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                              </Link>
                            </div>
                            <button
                              className="btn btn-sm btn-border view-profile-btn px-3 cursor-pointer"
                              onClick={() => {
                                setSelectedProfile(recipient);
                                handleSidebarClick("recipient-profile");
                              }}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredRecipients.length === 0 && (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">
                          No recipients found matching your criteria.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Section>

              {/* My Profile Section - REAL DATA */}
              <Section id="my-profile">
                <div className="container p-4">
                  {loading.profile ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Profile Header */}
                      <div className="row align-items-center mb-4">
                        <div className="col-4 col-md-2 text-center">
                          <img
                            src={
                              profile.profile_picture ||
                              "https://randomuser.me/api/portraits/men/32.jpg"
                            }
                            className="rounded-circle profile-pg-pic img-fluid shadow-sm"
                            alt="Profile"
                          />
                        </div>
                        <div className="col-8 col-md-7">
                          <h4 className="mb-1">
                            {profile.full_name || user?.username}
                          </h4>
                          <p className="text-muted icon-text mb-1">
                            <i className="fas fa-map-marker-alt text_success me-1 mt-1"></i>
                            {profile.location || "Location not set"}
                          </p>
                          <span className="badge badge-verified text-white px-2 py-1">
                            {profile.is_verified
                              ? "✔ Verified"
                              : "Pending Verification"}
                          </span>
                        </div>
                      </div>

                      {/* Contact & Background Info */}
                      <div className="row gy-4">
                        <div className="col-md-6">
                          <div className="section-title mb-3">
                            Contact Information
                          </div>
                          <p className="icon-text mb-2">
                            <i className="fas fa-envelope text_success me-1 mt-1"></i>
                            Email: {profile.email || user?.email}
                          </p>
                          <p className="icon-text mb-2">
                            <i className="fas fa-phone-alt text_success me-1 mt-1"></i>
                            Phone: {profile.phone || "Not provided"}
                          </p>
                          <p className="icon-text">
                            <i className="fas fa-lock text_success me-1 mt-1"></i>
                            Password: ********
                          </p>
                        </div>

                        <div className="col-md-6">
                          <div className="section-title mb-3">
                            Account Summary
                          </div>
                          <p className="icon-text mb-2">
                            <i className="fas fa-check-circle text_success me-1 mt-1"></i>
                            Member Since: {profile.member_since || "Jan 2024"}
                          </p>
                          <p className="icon-text mb-2">
                            <i className="fas fa-gift text_success me-1 mt-1"></i>
                            Donations Made: {profile.donation_count || 0}
                          </p>
                          <p className="icon-text mb-2">
                            <i className="fas fa-wallet text_success me-1 mt-1"></i>
                            Total Donated: PKR{" "}
                            {(profile.total_donated || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* About Me */}
                      <div className="mt-4">
                        <div className="section-title mb-2">About Me</div>
                        <p className="text-muted">
                          {profile.bio ||
                            "I'm a passionate donor committed to helping those in need. Together we can make a difference."}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Section>

              {/* Donations Section - REAL DATA */}
              <Section id="donations">
                <div className="text-start mb-4">
                  <p className="text-muted">
                    Track your past contributions and download receipts
                  </p>
                </div>

                {/* Summary Cards - REAL DATA */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4 col-12">
                    <div className="summary-card text-center">
                      <p className="mb-1">Total Donated</p>
                      <h5>PKR {totalDonated.toLocaleString()}</h5>
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="summary-card text-center">
                      <p className="mb-1">Donations Made</p>
                      <h5>{donationsCount}</h5>
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="summary-card text-center">
                      <p className="mb-1">Last Donation</p>
                      <h5>{lastDonation}</h5>
                    </div>
                  </div>
                </div>

                {/* Donation Cards - REAL DATA */}
                <ul className="nav nav-tabs mb-3 mt-5">
                  <li className="nav-item me-2">
                    <button
                      className={`nav-link cursor-pointer ${
                        activeTab === "Completed" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("Completed")}
                    >
                      Completed
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link cursor-pointer ${
                        activeTab === "Pending" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("Pending")}
                    >
                      Pending
                    </button>
                  </li>
                </ul>

                {loading.donations ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    {donations
                      .filter((d) => d.status === activeTab)
                      .map((donation, index) => (
                        <div
                          key={donation.id || index}
                          className="col-md-6 col-lg-4"
                        >
                          <div className="donation-card shadow-sm">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="fw-bold mb-1">
                                {donation.recipient_name || "Anonymous"}
                              </h6>
                              <span
                                className={`badge ${
                                  donation.status === "Completed"
                                    ? "btn_success"
                                    : "bg_warning text-dark"
                                }`}
                              >
                                {donation.status}
                              </span>
                            </div>
                            <p className="text-muted mb-1">
                              {donation.category || "General"}
                            </p>
                            <p className="mb-2">
                              <strong>
                                PKR {donation.amount.toLocaleString()}
                              </strong>{" "}
                              —{" "}
                              <small>
                                {new Date(donation.date).toLocaleDateString()}
                              </small>
                            </p>
                            <button className="btn btn-sm btn-outline-success w-100 cursor-pointer">
                              View Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                    {donations.filter((d) => d.status === activeTab).length ===
                      0 && (
                      <p className="text-muted">
                        No {activeTab.toLowerCase()} donations available.
                      </p>
                    )}
                  </div>
                )}
              </Section>

              <Section id="messages">
  <div style={{ maxWidth: 980, margin: "0 auto", padding: "12px 0" }}>
    <AidLinkChatUI
      apiUrl="http://127.0.0.1:8000/api/chatbot"
      themeColor="#90be54"
    />
  </div>
</Section>


              {/* Edit Profile Section - REAL DATA - FIXED */}
              <Section id="editprofile">
                <div className="container">
                  <form className="row" onSubmit={handleProfileUpdate}>
                    <div className="col-12 text-center">
                      <img
                        id="profilePreview"
                        src={
                          profile.profile_picture ||
                          "https://randomuser.me/api/portraits/men/32.jpg"
                        }
                        className="rounded-circle profile-pg-pic shadow-sm"
                        width="150"
                        height="150"
                        alt="Profile Picture"
                      />
                      <div
                        className="mt-3 mx-auto"
                        style={{ maxWidth: "200px" }}
                      >
                        <input
                          type="file"
                          className="form-control cursor-pointer"
                          id="profilePicInput"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <small className="text-muted">
                          Allowed: JPG, PNG (Max 2MB)
                        </small>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control cursor-text"
                        placeholder="John Doe"
                        value={profile.full_name || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, full_name: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control cursor-text"
                        placeholder="john@example.com"
                        value={profile.email || user?.email || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control cursor-text"
                        placeholder="0301-xxxxxxx"
                        value={profile.phone || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control cursor-text"
                        placeholder="Lahore, Pakistan"
                        value={profile.location || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="form-control cursor-text"
                        rows="3"
                        placeholder="Tell us about yourself..."
                        value={profile.bio || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                      ></textarea>
                    </div>

                    <div className="col-12 text-end">
                      <button
                        type="submit"
                        className="primary_btn text-white px-4 p-2 mt-4 donor-list-btn cursor-pointer"
                        disabled={loading.update}
                      >
                        {loading.update ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>Update Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Section>


              {/* Preferences Section - REAL DATA */}
              <Section id="prefrences">
                <div className="container">
                  <h5 className="mb-4 text-dark">
                    Please Set Your Preferences
                  </h5>

                  <form className="row g-4" onSubmit={handlePreferencesUpdate}>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium">Language</label>
                      <select
                        className="form-select custom-select cursor-pointer"
                        value={preferences.language || "English"}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            language: e.target.value,
                          })
                        }
                      >
                        <option>English</option>
                        <option>Urdu</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium">Currency</label>
                      <select
                        className="form-select custom-select cursor-pointer"
                        value={preferences.currency || "PKR"}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            currency: e.target.value,
                          })
                        }
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
                        className="form-select custom-select cursor-pointer"
                        value={preferences.date_format || "DD-MM-YYYY"}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            date_format: e.target.value,
                          })
                        }
                      >
                        <option>DD-MM-YYYY</option>
                        <option>MM-DD-YYYY</option>
                      </select>
                    </div>

                    <div className="col-12 text-end">
                      <button
                        className="primary_btn text-white px-4 py-2 donor-list-btn cursor-pointer"
                        type="submit"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              </Section>

              {/* Notifications Section - REAL DATA */}
              <Section id="notifications">
                <div className="container">
                  <h5 className="mb-4">Please Set Your Notification Setting</h5>

                  <form
                    className="row g-4"
                    onSubmit={handleNotificationsUpdate}
                  >
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input custom-checkbox cursor-pointer"
                          type="checkbox"
                          id="donationEmail"
                          defaultChecked
                        />
                        <label
                          className="form-check-label fs-6"
                          htmlFor="donationEmail"
                        >
                          Donation Confirmation Emails
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input custom-checkbox cursor-pointer"
                          type="checkbox"
                          id="monthlyReport"
                        />
                        <label
                          className="form-check-label fs-6"
                          htmlFor="monthlyReport"
                        >
                          Monthly Summary Reports
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input custom-checkbox cursor-pointer"
                          type="checkbox"
                          id="newRecipient"
                        />
                        <label
                          className="form-check-label fs-6"
                          htmlFor="newRecipient"
                        >
                          New Recipient Notifications
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        className="primary_btn text-white px-4 py-2 donor-list-btn cursor-pointer"
                        type="submit"
                      >
                        Save Notifications
                      </button>
                    </div>
                  </form>
                </div>
              </Section>

              {/* Matches Section */}
              <Section id="matches">
                <div className="container mt-5">
                  {/* Heading */}
                  <h4
                    className="mb-3 fw-bold text-center"
                    style={{ color: "#90be54", paddingBottom: "8px" }}
                  >
                    <i className="fa-solid fa-heart-circle-check me-2"></i>{" "}
                    Matches for You
                  </h4>

                  <p className="text-muted text-center mb-4">
                    Based on your selected preferences, our AI recommends
                    recipients who closely match your interests, donation
                    category, and budget. These suggestions update automatically
                    whenever a new relevant case is submitted.
                  </p>

                  {/* ---------- Set Preferences Form ---------- */}
                  <div
                    className="p-4 mb-4 border rounded"
                    style={{ background: "#ffffff" }}
                  >
                    <h5 className="fw-bold mb-3" style={{ color: "#90be54" }}>
                      <i className="fa-solid fa-sliders me-2"></i> Set Your
                      Match Preferences
                    </h5>

                    <p className="text-muted small mb-3">
                      Select your preferences so our AI can match you with the
                      most relevant recipients.
                    </p>

                    <form className="row g-3" onSubmit={handleSavePreferences}>
                      {/* Preferred Categories (Checkbox Grid) */}
                      <div className="col-12 col-md-8 mb-2">
                        <label className="form-label fw-semibold d-flex align-items-center">
                          <i
                            className="fa-solid fa-list-ul me-2"
                            style={{ color: "#90be54" }}
                          ></i>
                          Preferred Categories
                        </label>

                        <div className="row g-1 mt-1">
                          {["Education", "Medical", "Orphan", "Food"].map(
                            (cat) => (
                              <div className="col-3" key={cat}>
                                <div className="form-check">
                                  <input
                                    className="form-check-input cursor-pointer"
                                    type="checkbox"
                                    name="categories"
                                    value={cat.toLowerCase()}
                                    id={cat}
                                  />
                                  <label
                                    className="form-check-label cursor-pointer"
                                    htmlFor={cat}
                                  >
                                    {cat}
                                  </label>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <small className="text-muted">
                          Select one or multiple categories.
                        </small>
                      </div>

                      {/* Budget Range */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          <i
                            className="fa-solid fa-money-bill-wave me-2"
                            style={{ color: "#90be54" }}
                          ></i>
                          Donation Budget Range
                        </label>
                        <select className="form-select" name="budget" required>
                          <option value="1000-3000">PKR 1,000 – 3,000</option>
                          <option value="3000-7000">PKR 3,000 – 7,000</option>
                          <option value="7000-15000">PKR 7,000 – 15,000</option>
                          <option value="15000-30000">
                            PKR 15,000 – 30,000
                          </option>
                        </select>
                      </div>

                      {/* Keywords */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i
                            className="fa-solid fa-tags me-2"
                            style={{ color: "#90be54" }}
                          ></i>
                          Interest Keywords
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="keywords"
                          placeholder="e.g., students, cancer, widows, emergency cases"
                        />
                        <small className="text-muted">
                          Add comma-separated keywords to refine
                          recommendations.
                        </small>
                      </div>

                      {/* Submit */}
                      <div className="col-12 text-end">
                        <button
                          type="submit"
                          className="primary_btn text-white px-4 py-2 cursor-pointer"
                        >
                          <i className="fa-solid fa-check me-2"></i> Save
                          Preferences
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* ---------- AI Matches Placeholder ---------- */}
                  <div
                    className="text-center p-4 border rounded"
                    style={{ background: "#f8f9fa" }}
                  >
                    <i
                      className="fa-solid fa-wand-magic-sparkles fa-2x mb-2"
                      style={{ color: "#90be54" }}
                    ></i>
                    <p className="fw-semibold mb-0">
                      Your personalized matches will appear here.
                    </p>
                    <span className="text-muted small">
                      AI is finding cases that fit your preferences...
                    </span>
                  </div>
                </div>
              </Section>

              {/* Logout Section */}
              <Section id="logout">
                <div className="container mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 p-4 rounded shadow-sm bg-white">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h4 className="mb-2" style={{ color: "#90be54" }}>
                          <i className="fas fa-user-shield me-2"></i>Account
                          Security
                        </h4>
                        <p className="text-muted">
                          Manage your account sessions and logout securely.
                        </p>
                      </div>

                      {/* Logout from all devices */}
                      <div className="border rounded-3 p-3 mb-3 text-start">
                        <h6 className="fw-bold mb-2">
                          <i className="fas fa-sign-out-alt me-2 text-danger"></i>
                          Logout from all devices
                        </h6>

                        <p className="small text-muted mb-3">
                          This will sign you out from all browsers and devices
                          instantly.
                        </p>

                        <button
                          className="btn btn-outline-danger w-100 cursor-pointer"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to logout from all devices?"
                              )
                            ) {
                              handleLogoutLocal(); // ← THE FIX
                            }
                          }}
                        >
                          Confirm Logout
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="border rounded-3 p-3 bg-light text-start">
                        <h6 className="fw-bold mb-2 text-danger">
                          <i className="fas fa-user-times me-2"></i>Delete
                          Account
                        </h6>

                        <p className="small text-muted mb-3">
                          Once deleted, your account and all associated data
                          will be permanently removed.
                        </p>

                        <button
                          className="btn btn-outline-secondary w-100 cursor-pointer"
                          onClick={() => {
                            const confirmation = window.prompt(
                              "Type DELETE to confirm permanent account deletion:"
                            );
                            if (confirmation === "DELETE") {
                              setMessage("Account deletion requested.");
                              // TODO: connect to backend delete API
                            } else {
                              alert(
                                "Deletion cancelled or incorrect confirmation."
                              );
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

              {/* Recipient Profile Section - REAL DATA */}
              <Section id="recipient-profile">
                {selectedProfile ? (
                  <div className="container dashboard-section py-4">
                    <div className="mb-3">
                      <button
                        className="btn p-0 fw-semibold cursor-pointer"
                        style={{ color: "#90be54", textDecoration: "none" }}
                        onClick={() => handleSidebarClick("recipients")}
                      >
                        <i className="bi bi-arrow-left me-2"></i>Back
                      </button>
                    </div>

                    <div className="row align-items-center gy-4">
                      <div className="col-12 col-md-3 text-center">
                        <img
                          src={
                            selectedProfile.image ||
                            "https://randomuser.me/api/portraits/lego/1.jpg"
                          }
                          className="rounded-circle shadow-sm mb-2"
                          width="120"
                          height="120"
                          alt={selectedProfile.name}
                        />
                        <div>
                          <span
                            className="badge text-white px-3 py-2"
                            style={{ backgroundColor: "#90be54" }}
                          >
                            {selectedProfile.is_verified
                              ? "✔ Verified"
                              : "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="col-12 col-md-9 text-center text-md-start">
                        <h4 className="fw-bold mb-1">{selectedProfile.name}</h4>
                        <p className="text-muted mb-1">
                          {selectedProfile.reason ||
                            selectedProfile.description}
                        </p>
                        <p className="text-muted mb-1">
                          <i
                            className="bi bi-geo-alt-fill me-1"
                            style={{ color: "#90be54" }}
                          ></i>
                          {selectedProfile.location}
                        </p>
                        <p className="text-muted mb-0">
                          <i
                            className="bi bi-stars me-1"
                            style={{ color: "#90be54" }}
                          ></i>
                          Match with you:{" "}
                          <strong>{selectedProfile.match || 50}%</strong>
                        </p>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="row gy-4">
                      <div className="col-12 col-md-6">
                        <h5 className="section-title mb-3">Donation Details</h5>
                        <p className="icon-text mb-2">
                          <i
                            className="bi bi-cash-coin me-2"
                            style={{ color: "#90be54" }}
                          ></i>
                          Requested:{" "}
                          <strong>
                            PKR{" "}
                            {selectedProfile.required_amount?.toLocaleString() ||
                              0}
                          </strong>
                        </p>
                        <p className="icon-text mb-2">
                          <i
                            className="bi bi-piggy-bank me-2"
                            style={{ color: "#90be54" }}
                          ></i>
                          Donated:{" "}
                          <strong>
                            PKR{" "}
                            {selectedProfile.donated_amount?.toLocaleString() ||
                              0}
                          </strong>
                        </p>
                        <p className="icon-text mb-3">
                          <i
                            className="bi bi-hourglass-split me-2"
                            style={{ color: "#90be54" }}
                          ></i>
                          Remaining:{" "}
                          <strong>
                            PKR{" "}
                            {Math.max(
                              0,
                              (selectedProfile.required_amount || 0) -
                                (selectedProfile.donated_amount || 0)
                            ).toLocaleString()}
                          </strong>
                        </p>

                        <div className="mt-3">
                          <Link
                            to="/donate"
                            className="primary_btn fw-semibold cursor-pointer"
                            style={{ padding: "6px 20px", fontSize: "0.95rem" }}
                          >
                            Donate Now
                          </Link>
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <h5 className="section-title mb-3">
                          Verified Documents
                        </h5>
                        {selectedProfile.documents &&
                        selectedProfile.documents.length > 0 ? (
                          <div className="d-flex flex-wrap gap-3">
                            {selectedProfile.documents.map((doc, index) => (
                              <a
                                key={index}
                                href={doc.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                <div className="card shadow-sm text-center p-3 border-0">
                                  <i
                                    className="bi bi-file-earmark-check fs-3"
                                    style={{ color: "#90be54" }}
                                  ></i>
                                  <p className="mt-2 mb-0 small text-dark">
                                    {doc.name || "Document"}
                                  </p>
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted">
                            No verified documents available yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="section-title mb-2">
                      About the Recipient
                    </div>
                    <p className="mb-0">
                      {selectedProfile.about ||
                        selectedProfile.bio ||
                        "This recipient has not added their bio yet. Here you can view a short description about their background, needs, and reasons for donation."}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted py-5">
                    No recipient selected.
                  </div>
                )}
              </Section>
            </div>

            {/* Chat Box - SAME */}
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
                <span className="fw-semibold">Chat</span>
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm cursor-pointer"
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
                <p className="text-muted small mb-0">
                  Introduce yourself and describe your need.
                </p>
              </div>
              <div className="card-footer border-0 p-2 bg-white">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    id="chatInput"
                    className="form-control cursor-text"
                    placeholder="Type your message..."
                  />
                  <button
                    className="btn text-white cursor-pointer"
                    style={{ backgroundColor: "#90be54" }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Box - REAL DATA */}
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
                    className="btn-close btn-close-white btn-sm cursor-pointer"
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
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div key={index} className="border-bottom pb-2 mb-2">
                        <p className="small mb-1">{notification.message}</p>
                        <small className="text-muted">
                          {new Date(
                            notification.created_at
                          ).toLocaleDateString()}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small mb-0">
                      No notifications available at the moment.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
