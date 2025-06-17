import React from 'react';
import { useTheme } from './context/ThemeContext'; // Adjust the import path as necessary
import Footer from './components/Footer';

const Dashboard = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
  <div
    className={`relative min-h-screen bg-cover bg-center flex flex-col transition-all duration-300 ${
      isDark ? 'brightness-75' : 'brightness-100'
    }`}
    style={{
      backgroundImage:
        "url('https://img.freepik.com/free-photo/scene-with-photorealistic-logistics-operations-proceedings_23-2151468862.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')",
    }}
  >
    {/* Overlay with content */}
    <div
      className={`flex-1 relative flex flex-col justify-center items-center text-white ${
        isDark ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'
      } transition-all duration-300`}
    >
      {/* Navigation Bar at the top right */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <a
          href="/about"
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-500 hover:to-blue-500 "
          style={{ textDecoration: 'none' }}
        >
          About Us
        </a>

        <a
          href="/how-it-works"
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-500 hover:to-blue-500 "
          style={{ textDecoration: 'none' }}
        >
          How It Works
        </a>

        <a
          href="/contact"
          className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-500 hover:to-blue-500 "
          style={{ textDecoration: 'none' }}
        >
          Contact
        </a>

        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <h1
        className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
          isDark ? 'text-blue-400' : 'text-white'
        }`}
      >
        Welcome to Our Logistics Platform
      </h1>

      <p
        className={`text-lg md:text-xl mb-6 text-center px-4 transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-white'
        }`}
      >
        Your one-stop solution for on-demand transportation services. Book, track,
        and manage your shipments seamlessly.
      </p>

      <div className="flex space-x-4">
        <button
          className={`px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
            isDark
              ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
          onClick={() => (window.location.href = '/register')}
        >
          Register
        </button>
        <button
          className={`px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
            isDark
              ? 'bg-blue-500 text-white hover:bg-blue-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={() => (window.location.href = '/login')}
        >
          Login
        </button>
      </div>
    </div>

    {/* Footer at the bottom */}
    <Footer />
  </div>
);

};

export default Dashboard;