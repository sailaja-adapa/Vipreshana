import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={`w-full flex items-center justify-between px-6 py-4 shadow-md fixed top-0 left-0 z-50 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center gap-6">
        <Link to="/" className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Vipreshana</Link>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/bookings" className="hover:underline">Bookings</Link>
        <Link to="/user" className="hover:underline">User</Link>
        <Link to="/how-it-works" className="hover:underline">How It Works</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`ml-4 p-2 rounded-full transition-all duration-300 shadow ${isDark ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}`}
        aria-label="Toggle theme"
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      {/* Hamburger menu for mobile */}
      <button
        className={`md:hidden ml-2 p-2 focus:outline-none rounded transition-colors duration-200 ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
      >
        <span className={`block w-6 h-0.5 mb-1 ${isDark ? 'bg-yellow-400' : 'bg-gray-900'}`}></span>
        <span className={`block w-6 h-0.5 mb-1 ${isDark ? 'bg-yellow-400' : 'bg-gray-900'}`}></span>
        <span className={`block w-6 h-0.5 ${isDark ? 'bg-yellow-400' : 'bg-gray-900'}`}></span>
      </button>
      {/* Mobile menu */}
      <div className={`fixed top-0 right-0 h-full w-60 shadow-lg transform transition-transform duration-200 z-50 ${menuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col
        ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
        border-l ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <button
          className={`self-end m-4 text-2xl ${isDark ? 'text-yellow-400' : 'text-gray-900'}`}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >&times;</button>
        <nav className="flex flex-col px-8 gap-6 mt-8 text-lg">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:underline">Dashboard</Link>
          <Link to="/bookings" onClick={() => setMenuOpen(false)} className="hover:underline">Bookings</Link>
          <Link to="/user" onClick={() => setMenuOpen(false)} className="hover:underline">User</Link>
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className="hover:underline">How It Works</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:underline">Contact</Link>
          <button
            onClick={toggleTheme}
            className={`mt-8 self-center p-2 rounded-full shadow transition-all duration-300 ${isDark ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}`}
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
      {/* Overlay when mobile menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;