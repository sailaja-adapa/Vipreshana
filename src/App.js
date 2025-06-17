import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./components/User";
import Driver from "./components/Driver";
import Login from "./login";
import Registration from "./Registration";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import Location from "./Location";
import LoginDashboard from "./LoginDashboard";
import Bookings from "./Bookings";
import ResetPassword from "./ResetPassword";
import AdminDashboard from "./AdminDashboard";
import Contact from "./Contact";
import About from "./About";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/user" element={<User />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/location" element={<Location />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logindashboard" element={<LoginDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          draggable
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
