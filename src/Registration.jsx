import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Shield, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';
import { useTheme } from './context/ThemeContext';
import OTPVerification from './components/OTPVerification';
import LiveBackgroundLight from './components/livebackground/LiveBackgroundLight';
import LiveBackgroundDark from './components/livebackground/LiveBackgroundDark';

import API_BASE_URL from './config/api';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [choiceForOTP, setChoiceForOTP] = useState(''); // 'sms' or 'email'
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState('');


  const { theme } = useTheme();
  const isDark = theme === 'dark';

   const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    const moderateRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (strongRegex.test(password)) return 'Strong';
    else if (moderateRegex.test(password)) return 'Moderate';
    else return 'Weak';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }



    if (formData.role === 'admin' && !formData.email.endsWith('@svecw.edu.in')) {
      toast.error('Please enter a valid email for admin registration.');
      return;
    }

    if (!choiceForOTP) {
      setError('Please choose SMS or Email for OTP verification');
      return;
    }

    // Send OTP first
    try {
      const otpData = {
        verificationType: choiceForOTP === 'sms' ? 'phone' : 'email',
        ...(choiceForOTP === 'sms' ? { phone: formData.phone } : { email: formData.email })
      };

      console.log('📤 Frontend sending OTP data:', otpData);
      console.log('🔍 choiceForOTP:', choiceForOTP);

      const response = await axios.post(`${API_BASE_URL}/api/send-otp`, otpData);
      
      if (response.data.success) {
        setShowOTPVerification(true);
      } else {
        setError(response.data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleOTPVerificationSuccess = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      });
      toast.success(response.data.message);
      setIsLoading(false);
      navigate('/login');
    } catch (err) {
      setIsLoading(false);
      setError('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
      setShowOTPVerification(false); // Go back to form if registration fails
    }
  };

  const handleBackToForm = () => {
    setShowOTPVerification(false);
    setError('');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'user': return <User className="w-4 h-4" />;
      case 'driver': return <span className="text-sm">🚗</span>;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'user': return isDark ? 'bg-blue-900 text-blue-100 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'driver': return isDark ? 'bg-green-900 text-green-100 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
      case 'admin': return isDark ? 'bg-purple-900 text-purple-100 border-purple-700' : 'bg-purple-100 text-purple-800 border-purple-200';
      default: return isDark ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Show OTP verification component if needed
  if (showOTPVerification) {
    return (
      <>
        <PageMeta />
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isDark ? 'bg-black text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-900'
        }`}>
          <ToastContainer />
          <div className="w-full max-w-5xl mx-auto relative z-10">
            <div className={`rounded-2xl shadow-xl border p-6 sm:p-8 lg:p-12 transition-all duration-300 ${
              isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white/80 border-white/20 text-gray-900'
            }`}>
              <OTPVerification
                phone={choiceForOTP === 'sms' ? formData.phone : null}
                email={choiceForOTP === 'email' ? formData.email : null}
                verificationType={choiceForOTP === 'sms' ? 'phone' : 'email'}
                onVerificationSuccess={handleOTPVerificationSuccess}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta />
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300" style={{ marginTop: '57px' }}>
        {/* Live animated background */}
        <div className="absolute inset-0 w-full h-full z-0">
          {isDark ? <LiveBackgroundDark /> : <LiveBackgroundLight />}
        </div>
        {/* Main content above background */}
        <div className="w-full max-w-5xl mx-auto relative z-10">
          <div className={`rounded-2xl shadow-xl border p-6 sm:p-8 lg:p-12 transition-all duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Join us and get started today</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-300 mt-0.5" />
                <span className="text-red-700 dark:text-red-200 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {['name', 'email'].map((field, i) => (
                  <div key={i}>
                    <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {field === 'name' ? 'Full Name' : 'Email Address'}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 rounded-lg border shadow-sm transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                      placeholder={`Enter your ${field === 'name' ? 'full name' : 'email'}`}
                    />
                  </div>
                ))}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  ['password', showPassword, setShowPassword], 
                  ['confirmPassword', showConfirmPassword, setShowConfirmPassword]
                ].map(([name, show, setShow], i) => (
                  <div key={i}>
                    <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {name === 'password' ? 'Password' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={show ? 'text' : 'password'}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                        className={`w-full p-3 pr-12 rounded-lg border shadow-sm transition-all duration-200 ${
                          isDark
                            ? 'bg-gray-800 border-gray-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-900'
                        }`}
                        placeholder={name === 'password' ? 'Create a password' : 'Confirm password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    

                  </div>
                ))}
              </div>

              {/* Phone & Role */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg border shadow-sm transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Account Type</label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 rounded-lg border shadow-sm appearance-none ${
                        isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="user">👤 Regular User</option>
                      <option value="driver">🚗 Driver</option>
                      <option value="admin">🛠️ Administrator</option>
                    </select>
                    <div className={`absolute right-12 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleBadgeColor(formData.role)}`}>
                      {getRoleIcon(formData.role)}
                      <span className="capitalize">{formData.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {formData.role === 'admin' && (
                <div className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-600 rounded-lg p-2">
                  ⚠️ Admin registration requires a valid @svecw.edu.in email address
                </div>
              )}

              {/* OTP Choice */}
              <div className="space-y-3">
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Choose OTP verification method:
                </label>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                    choiceForOTP === 'sms'
                      ? isDark
                        ? 'bg-blue-900 border-blue-600 text-blue-100'
                        : 'bg-blue-50 border-blue-300 text-blue-700'
                      : isDark
                      ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="otpChoice"
                      value="sms"
                      checked={choiceForOTP === 'sms'}
                      onChange={(e) => setChoiceForOTP(e.target.value)}
                      className="sr-only"
                    />
                    <Phone className="w-4 h-4" />
                    <span>SMS</span>
                  </label>
                  
                  <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                    choiceForOTP === 'email'
                      ? isDark
                        ? 'bg-blue-900 border-blue-600 text-blue-100'
                        : 'bg-blue-50 border-blue-300 text-blue-700'
                      : isDark
                      ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="otpChoice"
                      value="email"
                      checked={choiceForOTP === 'email'}
                      onChange={(e) => setChoiceForOTP(e.target.value)}
                      className="sr-only"
                    />
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Continue to Verification
                  </div>
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className={`font-semibold hover:underline ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
