import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar'; // <-- Add this import
import PageMeta from './components/Pagemeta';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { theme, toggleTheme } = useTheme(); 
    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/forgot-password', { email });
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
            toast.error('❌ Failed to send reset link. Please try again.', {
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
            <Navbar />
            <div className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
                theme === 'dark' ? 'bg-gray-900' : ''
            }`} style={{ 
                backgroundImage: theme === 'light' 
                    ? "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" 
                    : "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')"
            }}>
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 shadow-lg z-10 ${
                        theme === 'dark' 
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                            : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    }`}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark' ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-60'
                }`}>
                    <div className={`p-10 rounded-lg shadow-xl w-96 transition-all duration-300 ${
                        theme === 'dark' 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-white'
                    }`}>
                        <div className="text-center mb-6">
                            <div className={`text-6xl mb-4 ${theme === 'dark' ? 'opacity-80' : 'opacity-90'}`}>
                                🔐
                            </div>
                            <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                                Forgot Password
                            </h1>
                            <p className={`text-md text-center mb-6 transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Enter your email to receive a password reset link.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    📧 Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={email}
                                    onChange={handleChange}
                                    className={`w-full border rounded-md shadow-sm p-3 transition-all duration-300 ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-300 placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200 placeholder-gray-500'
                                    }`}
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                                    theme === 'dark' 
                                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/25' 
                                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/25'
                                }`}
                            >
                                Send Reset Link
                            </button>
                        </form>

                        {/* Additional Help Section */}
                        <div className={`mt-6 p-4 rounded-lg transition-all duration-300 ${
                            theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                        }`}>
                            <h3 className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                                💡 Need Help?
                            </h3>
                            <ul className={`text-xs space-y-1 transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                <li>• Check your spam/junk folder for the reset email</li>
                                <li>• Make sure you entered the correct email address</li>
                                <li>• The reset link expires in 1 hour</li>
                            </ul>
                        </div>

                        {/* Back to Login Link */}
                        <div className="mt-6 text-center">
                            <p className={`text-sm transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Remember your password?{' '}
                                <button
                                    onClick={() => window.history.back()}
                                    className={`font-medium transition-colors duration-300 hover:underline ${
                                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                                    }`}
                                >
                                    Back to Login
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
                <ToastContainer theme={theme} />
            </div>
        </>
    );
};

export default ForgotPassword;