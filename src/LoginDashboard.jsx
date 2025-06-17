import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Footer from './components/Footer';

const LoginDashboard = () => {
    const navigate = useNavigate(); 
    

    const [fallbackTheme, setFallbackTheme] = useState('light');
    
    
    let theme, toggleTheme;
    try {
        const themeContext = useTheme();
        theme = themeContext.theme;
        toggleTheme = themeContext.toggleTheme;
    } catch (error) {
        console.warn('ThemeContext not available, using fallback:', error);
        theme = fallbackTheme;
        toggleTheme = () => {
            setFallbackTheme(prev => prev === 'light' ? 'dark' : 'light');
        };
    }

    console.log('Current theme in component:', theme); // Debug log

    const handleBookingsClick = () => {
        console.log('Navigating to bookings...');
        try {
            navigate('/bookings');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleNewBookingsClick = () => {
        console.log('Navigating to user...');
        try {
            navigate('/user');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleThemeToggle = () => {
        console.log('Theme toggle clicked, current theme:', theme);
        toggleTheme();
    };

    return (
  <div
    className={`min-h-screen flex flex-col transition-all duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : ''
    }`}
    style={{
      backgroundImage:
        theme === 'light'
          ? "url('https://media.istockphoto.com/id/174870355/photo/visual-representation-of-transportation-modes.jpg?s=612x612&w=0&k=20&c=IjL0uThZwQHau2TKnBseS_lAFRxVObjmN7o_GRuUB0E=')"
          : "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {/* Theme Toggle Button */}
    <button
      onClick={handleThemeToggle}
      type="button"
      className={`absolute top-4 left-4 p-3 rounded-full transition-all duration-300 cursor-pointer z-30 border-2 ${
        theme === 'dark'
          ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 border-yellow-300 shadow-lg hover:shadow-xl'
          : 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border-gray-600 shadow-lg hover:shadow-xl'
      } transform hover:scale-110 active:scale-95`}
      title={`Currently ${theme} mode - Click to switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="text-2xl block">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>

    {/* Main Content */}
    <div
      className={`flex-1 relative transition-all duration-300 ${
        theme === 'dark' ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-40'
      }`}
    >
      {/* Navigation Buttons */}
      <div className="absolute top-4 right-8 flex flex-col sm:flex-row gap-4 z-20">
        <button
          type="button"
          onClick={handleBookingsClick}
          onMouseDown={(e) => e.preventDefault()}
          className={`cursor-pointer px-8 py-4 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
              : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800'
          }`}
        >
          📋 View All Bookings
        </button>

        <button
          type="button"
          onClick={handleNewBookingsClick}
          onMouseDown={(e) => e.preventDefault()}
          className={`cursor-pointer px-8 py-4 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900'
              : 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800'
          }`}
        >
          ➕ Create New Booking
        </button>
      </div>

      {/* Welcome Message */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
  <div className={`text-center p-8 rounded-lg transition-all duration-300 ${
    theme === 'dark' 
      ? 'bg-gray-800 bg-opacity-90 border border-gray-700' 
      : 'bg-white bg-opacity-90'
  } shadow-2xl`}>
    <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`}>
      Welcome to Dashboard
    </h1>
    <p className={`text-xl transition-colors duration-300 ${
      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
    }`}>
      Manage your bookings and transportation needs
    </p>
  </div>
</div>
    </div>

    {/* Footer at the very bottom */}
    <Footer />
  </div>
);

};

export default LoginDashboard;
