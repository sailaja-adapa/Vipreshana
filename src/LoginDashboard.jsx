import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginDashboard = () => {
  const navigate = useNavigate();
  const [fallbackTheme, setFallbackTheme] = useState("light");

  let theme, toggleTheme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    console.warn("ThemeContext not available, using fallback:", error);
    theme = fallbackTheme;
    toggleTheme = () => {
      setFallbackTheme((prev) => (prev === "light" ? "dark" : "light"));
    };
  }

  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === "object" &&
        Object.keys(parsed).length > 0
      ) {
        setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { position: "top-right" });
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleBookingsClick = () => navigate("/bookings");
  const handleNewBookingsClick = () => navigate("/user");

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/); // split by space(s)
    const initials = words.map((word) => word[0].toUpperCase());
    return initials.slice(0, 2).join(""); // only first two initials
  };

  return (
    <div
      className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900" : ""
      }`}
      style={{
        backgroundImage:
          theme === "light"
            ? "url('https://media.istockphoto.com/id/174870355/photo/visual-representation-of-transportation-modes.jpg?s=612x612&w=0&k=20&c=IjL0uThZwQHau2TKnBseS_lAFRxVObjmN7o_GRuUB0E=')"
            : "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <ToastContainer />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        type="button"
        className={`absolute top-4 left-4 w-14 h-14 rounded-full z-30 border-2 transition-all duration-300 cursor-pointer shadow-lg transform hover:scale-110 active:scale-95 flex items-center justify-center text-2xl ${
          theme === "dark"
            ? "bg-yellow-400 text-gray-900 border-yellow-300 hover:bg-yellow-300"
            : "bg-gray-800 text-yellow-400 border-gray-600 hover:bg-gray-700"
        }`}
        title={`Currently ${theme} mode - Click to switch to ${
          theme === "light" ? "dark" : "light"
        } mode`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* User Profile Circle */}
      {user && (
        <div className="absolute top-4 left-20 z-30">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            type="button"
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 shadow-lg transform hover:scale-110 active:scale-95 ${
              theme === "dark"
                ? "bg-yellow-400 text-gray-900 border-yellow-300 hover:bg-yellow-300"
                : "bg-gray-800 text-yellow-400 border-gray-600 hover:bg-gray-700"
            }`}
            title="User Profile"
          >
            {getInitials(user.name)}
          </button>

          {/* Dropdown stays unchanged */}
          {showDropdown && (
            <div
              className={`mt-2 w-64 p-4 rounded-lg shadow-xl absolute z-40 transition-all duration-300 border ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <h2 className="text-lg font-semibold mb-2">{user.name}</h2>
              <p className="text-sm mb-1">📧 Email: {user.email}</p>
              <p className="text-sm mb-1">📱 Phone: {user.phone}</p>
              <p className="text-sm mb-4">🧑‍💼 Role: {user.role}</p>
              <button
                onClick={handleLogout}
                className={`w-full px-4 py-2 rounded-md font-semibold transition duration-200 ${
                  theme === "dark"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dark overlay */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          theme === "dark" ? "bg-black bg-opacity-70" : "bg-black bg-opacity-40"
        }`}
      ></div>

      {/* Navigation Buttons */}
      <div className="absolute top-4 right-8 flex flex-col sm:flex-row gap-4 z-20">
        <button
          onClick={handleBookingsClick}
          className={`px-8 py-4 font-semibold rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
              : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
          }`}
        >
          📋 View All Bookings
        </button>
        <button
          onClick={handleNewBookingsClick}
          className={`px-8 py-4 font-semibold rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
            theme === "dark"
              ? "bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900"
              : "bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800"
          }`}
        >
          ➕ Create New Booking
        </button>
      </div>

      {/* Welcome Message */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className={`text-center p-8 rounded-lg transition-all duration-300 shadow-2xl ${
            theme === "dark"
              ? "bg-gray-800 bg-opacity-90 border border-gray-700 text-white"
              : "bg-white bg-opacity-90 text-gray-800"
          }`}
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to Dashboard</h1>
          <p className="text-xl">
            Manage your bookings and transportation needs
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginDashboard;
