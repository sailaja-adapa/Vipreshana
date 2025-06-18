import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext'; // Adjust the import path as necessary
import PageMeta from './components/Pagemeta';
const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    // Extract token from URL query parameters
    const token = new URLSearchParams(location.search).get('token');
    const isDark = theme === 'dark';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!", { position: "top-center" });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/reset-password', {
                token,
                newPassword
            });

            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                icon: "✅",
                style: {
                    backgroundColor: '#28a745',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    padding: '16px',
                },
                progressStyle: {
                    backgroundColor: '#fff'
                }
            });
        } catch (error) {
            toast.error("Failed to reset password. Please try again.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: {
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    padding: '16px',
                },
                progressStyle: {
                    backgroundColor: '#fff'
                }
            });
        }
    };

    return (
        <>
        <PageMeta /> 
        <div 
            className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
                isDark ? 'brightness-75' : 'brightness-100'
            }`}
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
        >
            <div className={`absolute inset-0 ${isDark ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-60'} flex items-center justify-center transition-all duration-300`}>
                
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ${
                        isDark 
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                            : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    }`}
                    aria-label="Toggle theme"
                >
                    {isDark ? '☀️' : '🌙'}
                </button>

                <div className={`p-10 rounded-lg shadow-lg w-96 transition-all duration-300 ${
                    isDark 
                        ? 'bg-gray-800 text-white border border-gray-700' 
                        : 'bg-white text-gray-900'
                }`}>
                    <h1 className={`text-4xl font-bold text-center mb-2 transition-colors duration-300 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>Reset Password</h1>
                    <p className={`text-md text-center mb-6 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Enter a new password for your account.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="newPassword" className={`block text-sm font-medium transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>🔒 New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-30' 
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                                }`}
                                placeholder="Enter your new password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className={`block text-sm font-medium transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>🔒 Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-30' 
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                                }`}
                                placeholder="Confirm your new password"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full font-semibold py-2 rounded-lg transition-all duration-300 ${
                                isDark
                                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
        </>
    );
};

export default ResetPassword;