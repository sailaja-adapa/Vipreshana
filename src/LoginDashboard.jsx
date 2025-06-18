import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Footer from './components/Footer';
import { Package, Plus, User, Truck, MapPin, Clock } from 'lucide-react';
import Navbar from './components/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageMeta from './components/Pagemeta';

const LoginDashboard = () => {
  const navigate = useNavigate();
  const [fallbackTheme, setFallbackTheme] = useState('light');
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  let theme, toggleTheme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    console.warn('ThemeContext not available, using fallback:', error);
    theme = fallbackTheme;
    toggleTheme = () => {
      setFallbackTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };
  }

  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookingsClick = () => navigate('/bookings');
  const handleNewBookingsClick = () => navigate('/user');
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { position: "top-right" });
    setTimeout(() => navigate("/login"), 1500);
  };
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/);
    return words.map(w => w[0].toUpperCase()).slice(0, 2).join("");
  };

  return (
    <>
      <PageMeta />
      <Navbar />
      <ToastContainer />
      <div className={`min-h-screen flex flex-col transition-all duration-300 pt-24 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {/* User Avatar and Dropdown */}
        {user && (
          <div className="absolute top-4 left-4 z-30">
            <button
              ref={buttonRef}
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl font-bold shadow-lg transform hover:scale-110 transition ${
                isDark
                  ? 'bg-yellow-400 text-gray-900 border-yellow-300'
                  : 'bg-gray-800 text-yellow-400 border-gray-600'
              }`}
            >
              {getInitials(user.name)}
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className={`mt-2 absolute w-64 p-4 rounded-lg z-40 shadow-xl border ${
                  isDark
                    ? 'bg-gray-900 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                <h2 className="text-lg font-semibold mb-2">{user.name}</h2>
                <p className="text-sm mb-1">📧 {user.email}</p>
                <p className="text-sm mb-1">📱 {user.phone}</p>
                <p className="text-sm mb-4">🧑‍💼 {user.role}</p>
                <button
                  onClick={handleLogout}
                  className={`w-full py-2 rounded-md font-semibold transition ${
                    isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hero Section */}
        <div
          className="relative h-80 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60)"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          <div className="relative z-10 flex items-center justify-center h-full text-white px-6 text-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Transportation Hub</h1>
              <p className="text-xl opacity-90">Your complete logistics management solution</p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-6 rounded-full" />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="p-6 -mt-20 relative z-10 max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Dashboard', icon: <User />, color: 'blue', text: 'Quick Access' },
              { title: 'Bookings', icon: <Package />, color: 'green', text: 'Manage' },
              { title: 'Request', icon: <Plus />, color: 'purple', text: 'Create New' }
            ].map(({ title, icon, color, text }, i) => (
              <div key={i} className={`p-6 rounded-2xl shadow-xl border-2 hover:scale-105 transition ${
                isDark ? 'bg-gray-800 border-gray-700 text-white' : `bg-white border-${color}-100 text-gray-800`
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {text}
                    </p>
                    <p className="text-lg font-bold mt-2">{title}</p>
                  </div>
                  <div className={`p-3 bg-${color}-500 rounded-full text-white`}>{icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: 'View All Bookings',
                desc: 'Access and manage all your transportation requests',
                points: ['Track delivery status', 'View pickup & delivery locations', 'Monitor vehicle assignments'],
                icon: <Package />,
                btnLabel: 'View All Bookings',
                btnClick: handleBookingsClick,
                btnColor: 'blue'
              },
              {
                title: 'Create New Booking',
                desc: 'Schedule a new transportation request quickly',
                points: ['Set pickup & delivery points', 'Choose vehicle type', 'Get instant cost estimates'],
                icon: <Plus />,
                btnLabel: 'Create New Booking',
                btnClick: handleNewBookingsClick,
                btnColor: 'green'
              }
            ].map((card, idx) => (
              <div key={idx} className={`rounded-2xl shadow-xl border-2 p-8 transition hover:scale-105 ${
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                    <p className="text-sm">{card.desc}</p>
                  </div>
                  <div className={`p-4 bg-${card.btnColor}-500 rounded-full text-white`}>
                    {card.icon}
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {card.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-lg">✔</span> {point}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={card.btnClick}
                  className={`w-full bg-${card.btnColor}-500 hover:bg-${card.btnColor}-600 text-white font-semibold py-4 px-6 rounded-xl transition`}
                >
                  {card.btnLabel}
                </button>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className={`mt-12 p-8 rounded-2xl shadow-xl border-2 ${
            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Our Platform?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { icon: <Clock />, title: 'Real-time Tracking', desc: 'Monitor your deliveries in real-time' },
                { icon: <Truck />, title: 'Flexible Fleet', desc: 'Various vehicles for all delivery sizes' },
                { icon: <MapPin />, title: 'Wide Coverage', desc: 'Deliveries in all major areas' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LoginDashboard;
