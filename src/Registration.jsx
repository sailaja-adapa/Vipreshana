import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';


const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user' // Default role
    });

    const [error, setError] = useState('');
    const [notification, setNotification] = useState(null);
    const { theme, toggleTheme } = useTheme();

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if password matches confirm password
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Check if the user is registering as an admin
        if (formData.role === 'admin' && !formData.email.endsWith('@svecw.edu.in')) {
            showNotification('Please enter a valid email for admin registration.', 'error');
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('Registration successful! Please login.', 'success');
            console.log('Registration successful for:', formData.name);
            
        } catch (err) {
            setError('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    const isDark = theme === 'dark';

    return (
        <div
            className={`flex items-center justify-center min-h-screen bg-cover bg-center transition-all duration-300 ${
                isDark ? 'brightness-75' : 'brightness-100'
            }`}
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
        >
            {/* Notification */}
            {notification && (
                <div
                    className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
                        notification.type === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                    }`}
                >
                    {notification.message}
                </div>
            )}

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

            <div className={`rounded-lg shadow-lg p-10 max-w-md w-full transition-all duration-300 ${
                isDark 
                    ? 'bg-gray-800 text-white border border-gray-700' 
                    : 'bg-white text-gray-900'
            }`}>
                <h1 className={`text-3xl font-bold text-center mb-5 transition-colors duration-300 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>Create an Account</h1>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <div onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>👤 Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>📧 Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>🔒 Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>🔒 Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Confirm your password"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>📞 Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                            placeholder="Enter your phone number"
                        />
                    </div>
                    {/* Role dropdown with icons */}
                    <div>
                        <label className={`block text-sm font-medium transition-colors duration-300 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>⭐ Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                        >
                            <option value="user">👤 User</option>
                            <option value="driver">🚗 Driver</option>
                            <option value="admin">🛠️ Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-3 rounded-md transition-all duration-300 ${
                            isDark
                                ? 'text-white bg-blue-500 hover:bg-blue-400'
                                : 'text-white bg-blue-600 hover:bg-blue-500'
                        }`}
                    >
                        Register
                    </button>
                    <p className={`text-center text-sm mt-4 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Already have an account?{' '}
                        <button className={`font-semibold hover:underline bg-transparent border-none cursor-pointer transition-colors duration-300 ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;