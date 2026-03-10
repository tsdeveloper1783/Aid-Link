import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Donor from "./pages/Donor";
import Recipient from "./pages/Recipient";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Error from "./pages/Error";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Learnmore from "./pages/Learnmore";
import ForgetPassword from "./pages/ForgetPassword";
import Events from "./pages/Events";
import Logout from "./pages/Logout";
import NewsletterPage from "./pages/NewsletterPage";
import Carousel from "./components/Carousel.jsx";

// ✅ Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/learnmore" element={<Learnmore />} />
        <Route path="/events" element={<Events />} />
        <Route path="/newsletterpage" element={<NewsletterPage />} />
        <Route path="/carousel" element={<Carousel />} />
        <Route path="/error" element={<Error />} />

        {/* Protected Routes */}
        <Route
          path="/donor"
          element={
            <ProtectedRoute>
              <Donor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipient"
          element={
            <ProtectedRoute>
              <Recipient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donate"
          element={
            <ProtectedRoute>
              <Donate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
