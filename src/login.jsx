import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInWithGoogle } from './lib/supabase';
import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';
import AuthRequired from './components/AuthRequired';

const API_BASE_URL = 'https://vipreshana-3.onrender.com';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cleanUrlOfTokens = () => {
    const currentUrl = window.location.toString();
    const hasSensitiveData =
      currentUrl.includes('access_token') ||
      currentUrl.includes('refresh_token') ||
      currentUrl.includes('id_token') ||
      currentUrl.includes('token=') ||
      currentUrl.includes('authorization=') ||
      currentUrl.includes('auth=');

    if (window.location.pathname.includes('/auth/')) {
      window.history.replaceState(null, document.title, '/logindashboard');
      return;
    }

    if (hasSensitiveData || window.location.hash || window.location.search) {
      window.history.replaceState(null, document.title, window.location.pathname);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    cleanUrlOfTokens();
   const validIndianNumber = /^[6-9]\d{9}$/;
const allowedTestPhones = ['4444444444', '1212122121']; // Add more if needed

if (!validIndianNumber.test(formData.phone) && !allowedTestPhones.includes(formData.phone)) {
  toast.error('⚠️ Enter a valid phone number');
  setIsLoading(false);
  return;
}

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, formData, {
        withCredentials: true // optional: for cookie-based auth
      });
      const { user, message } = response.data;

      if (user) {
        const safeUserData = {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role
        };

        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(safeUserData));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('authChange', { detail: { isAuthenticated: true, user: safeUserData } }));
        window.dispatchEvent(new Event('login'));

        toast.success(`🎉 ${message}`, {
          toastId: 'login-success',
          position: 'top-center',
          autoClose: 1500,
          style: {
            backgroundColor: '#28a745',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '12px',
            textAlign: 'center',
          },
        });

        setTimeout(() => {
          setIsLoading(false);
          cleanUrlOfTokens();
          const redirectPath = location.state?.from || '/logindashboard';
          navigate(redirectPath, { replace: true });
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('⚠️ Login failed! Please try again.', {
        toastId: 'login-error',
        position: 'top-center',
        autoClose: 3000,
        style: {
          backgroundColor: '#e60023',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      cleanUrlOfTokens();

      toast.success('Redirecting to Google sign-in...', {
        position: 'top-center',
        autoClose: 1500,
        style: {
          backgroundColor: '#28a745',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      });

      const redirectPath = location.state?.from || '/logindashboard';
      sessionStorage.setItem('auth_redirect', redirectPath);

      const { success, error } = await signInWithGoogle();
      if (!success) throw new Error(error);
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(`Google sign-in failed: ${error.message || 'Please try again'}`, {
        position: 'top-center',
        style: {
          backgroundColor: '#e60023',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      });
      setIsLoading(false);
    }
  };

  const isDisabled = !formData.phone || !formData.password;
  const redirectFrom = location.state?.from;

  return (
    <>
      <PageMeta />
      <Navbar />
      {redirectFrom && <AuthRequired redirectPath={redirectFrom} />}

      <div
        className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
          isDark ? 'brightness-75' : 'brightness-100'
        }`}
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg')",
        }}
      >
        <div
          className={`absolute inset-0 ${
            isDark ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-60'
          } flex items-center justify-center`}
        >
          <div
            className={`p-10 rounded-2xl shadow-2xl w-96 ${
              isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900'
            }`}
          >
            <h1
              className={`text-4xl font-bold text-center mb-2 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              Welcome Back!
            </h1>
            <p
              className={`text-md text-center mb-6 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Please enter your credentials to login.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  📞 Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  onChange={handleChange}
                  className={`mt-1 block w-full border rounded-xl shadow-sm p-3 ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔒 Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    onChange={handleChange}
                    className={`block w-full border rounded-xl shadow-sm p-3 ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-5 top-1/2 transform -translate-y-1/2 text-xl ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isDisabled || isLoading}
                className={`w-full font-semibold py-3 rounded-xl ${isDisabled || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
                </div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium ${isDark
                  ? 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.54-7.752 9.71-11.666l-9.71 0.001z"
                    fill="#FFC107"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Register & Forgot Password */}
            <p className={`text-center text-sm mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Register
              </Link>
            </p>
            <p className={`text-center text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <Link to="/forgot-password" className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
