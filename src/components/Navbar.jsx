import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiInfo, FiMap, FiPhone, FiUser, FiLogOut } from 'react-icons/fi';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.mobile-menu')) {
        setMenuOpen(false);
      }
      if (
        showUserDropdown &&
        !userDropdownRef.current?.contains(event.target) &&
        !avatarButtonRef.current?.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, showUserDropdown]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
  const toggleUserDropdown = () => setShowUserDropdown((prev) => !prev);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .trim()
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const handleLogout = async () => {
    try {
      if (signOut) await signOut();
      localStorage.clear();
      setUser(null);
      closeMenu();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isLoggedIn = isAuthenticated || !!user;

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full h-[4.5rem] z-50 px-4 py-2 flex items-center justify-between border-b shadow-md"
        style={{
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.15)',
        }}
      >
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-900" onClick={closeMenu}>
            <img src="/logo.png" alt="Vipreshana Logo" className="h-12 w-8 inline-block mr-1" />
            Vipreshana
          </Link>

          <div className="flex-1"></div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-base font-medium">
              <Link
                to="/about"
                className={`flex items-center gap-2 hover:text-blue-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <FiInfo /> About
              </Link>
              <Link
                to="/how-it-works"
                className={`flex items-center gap-2 hover:text-blue-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <FiMap /> How It Works
              </Link>
              <Link
                to="/contact"
                className={`flex items-center gap-2 hover:text-blue-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <FiPhone /> Contact
              </Link>
              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 hover:text-blue-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  <FiUser /> Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className={isDark ? 'text-yellow-300' : 'text-purple-500'}>
                {isDark ? <Sun /> : <Moon />}
              </button>

              {user && (
                <div className="relative">
                  <button
                    ref={avatarButtonRef}
                    onClick={toggleUserDropdown}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isDark ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
                    }`}
                  >
                    {getInitials(user.name)}
                  </button>

                  {showUserDropdown && (
                    <div
                      ref={userDropdownRef}
                      className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-50 ${
                        isDark
                          ? 'bg-gray-800 border border-gray-700'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={toggleMenu}
                className={`md:hidden p-2 rounded ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {menuOpen ? (
                  <span className="text-xl font-bold">&times;</span>
                ) : (
                  <>
                    <span
                      className={`block w-6 h-0.5 mb-1 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}
                    ></span>
                    <span
                      className={`block w-6 h-0.5 mb-1 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}
                    ></span>
                    <span
                      className={`block w-6 h-0.5 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}
                    ></span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`mobile-menu fixed top-0 right-0 h-full w-60 transform transition-transform duration-300 z-50 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden flex flex-col`}
        style={{
          backdropFilter: 'blur(24px)',
          backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.15)',
        }}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={closeMenu}
            className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            } hover:text-red-400`}
          >
            &times;
          </button>
        </div>

        {user && (
          <div
            className={`px-4 py-3 mb-4 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <p className="font-medium">{user.name}</p>
            <p className="text-sm opacity-75">{user.email}</p>
          </div>
        )}

        <nav className="flex flex-col px-4 gap-2">
          <Link
            to="/about"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
              isDark
                ? 'text-white hover:text-blue-400'
                : 'text-gray-900 hover:text-blue-500'
            }`}
          >
            <FiInfo /> About
          </Link>
          <Link
            to="/how-it-works"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
              isDark
                ? 'text-white hover:text-blue-400'
                : 'text-gray-900 hover:text-blue-500'
            }`}
          >
            <FiMap /> How It Works
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
              isDark
                ? 'text-white hover:text-blue-400'
                : 'text-gray-900 hover:text-blue-500'
            }`}
          >
            <FiPhone /> Contact
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                  isDark
                    ? 'text-white hover:text-blue-400'
                    : 'text-gray-900 hover:text-blue-500'
                }`}
              >
                <FiUser /> Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={closeMenu}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                  isDark
                    ? 'text-white hover:text-blue-400'
                    : 'text-gray-900 hover:text-blue-500'
                }`}
              >
                <FiUser /> My Profile
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className={`flex items-center gap-2 text-left px-4 py-3 rounded-lg transition ${
                  isDark
                    ? 'text-red-400 hover:text-red-500'
                    : 'text-red-600 hover:text-red-700'
                }`}
              >
                <FiLogOut /> Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;