import React, { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext'; 
import { useAuth } from './context/AuthContext';
import { Typewriter } from "./components/Typewriter";
import Navbar from './components/Navbar';


const Dashboard = () => {
    const { theme } = useTheme();
    const { isAuthenticated, user } = useAuth();
    const isDark = theme === 'dark';
    const [isLoaded, setIsLoaded] = useState(false);
    const [localUser, setLocalUser] = useState(null);

    // Load animations
    useEffect(() => {
        setIsLoaded(true);
    }, []);
    
    // Check authentication state
    // Initial check for user data in localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setLocalUser(JSON.parse(storedUser));
                console.log('Dashboard: Found user in localStorage');
            } else {
                console.log('Dashboard: No user found in localStorage');
                setLocalUser(null);
            }
        } catch (error) {
            console.error('Error reading user from localStorage:', error);
            setLocalUser(null);
        }
    }, []);
    
    // Log auth state changes
    useEffect(() => {
        console.log('Dashboard - Auth State:', { 
            isAuthenticated, 
            user,
            localUser: !!localUser,
            localStorage: !!localStorage.getItem('user')
        });
    }, [isAuthenticated, user, localUser]);
    
    // Set up auth change listeners
    useEffect(() => {
        const handleAuthChange = () => {
            console.log('Auth change event received in Dashboard');
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    setLocalUser(JSON.parse(userData));
                    console.log('Dashboard updated with user from event');
                } catch (e) {
                    console.error('Error parsing user data in auth change event:', e);
                    setLocalUser(null);
                }
            } else {
                console.log('Dashboard cleared user from event');
                setLocalUser(null);
            }
            
            // Force a component re-render
            setIsLoaded(prev => !prev);
            setTimeout(() => setIsLoaded(prev => !prev), 10);
        };
        
        // Listen for both storage and custom auth events
        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);
        window.addEventListener('login', handleAuthChange);
        window.addEventListener('logout', handleAuthChange);
        
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('login', handleAuthChange);
            window.removeEventListener('logout', handleAuthChange);
        };
    }, []);

    return (
        <>
            <Navbar />
            <div
                className={`relative h-screen bg-cover bg-center transition-all duration-700 ease-out font-inter ${
                    isDark ? 'brightness-30' : 'brightness-70'
                }`}
                style={{ backgroundImage: "url('https://img.freepik.com/free-photo/scene-with-photorealistic-logistics-operations-proceedings_23-2151468862.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
            >
                <div className={`absolute inset-0 ${isDark ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'} flex flex-col justify-center items-center text-white transition-all duration-700`}>
                    <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
                        <h1 className={`text-5xl md:text-7xl font-bold transition-all duration-1000 transform leading-tight ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        } ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-800' : 'text-white drop-shadow-lg'}`}
                            style={{ transitionDelay: '200ms', fontWeight: '800', letterSpacing: '-0.025em' }}
                        >
                            Powering the Future of 
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Smart Logistics
                            </span>
                        </h1>
                        
                        <p className={`text-lg md:text-xl mb-6 text-center max-w-2xl ${
                            isDark ? 'text-gray-300' : 'text-white'
                        }`}>
                            <Typewriter text="Seamlessly manage, track, and optimize your freight with our intelligent logistics platform built for speed, scale, and reliability." />
                        </p>
                        
                        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 transform ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                            style={{ transitionDelay: '400ms' }}
                        >
                            <div className="hidden">{`Auth state: ${isAuthenticated || !!localUser || !!localStorage.getItem('user') ? 'Authenticated' : 'Not authenticated'}`}</div>
                            
                            {/* Triple check authentication: context, state, or localStorage */}
                            {(isAuthenticated || !!localUser || !!localStorage.getItem('user')) ? (
                                <button
                                    className={`group relative px-6 py-2 rounded-xl font-semibold text-lg tracking-wide transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 ${
                                        isDark
                                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-600 text-white hover:from-gray-600 hover:to-gray-700 hover:shadow-xl hover:shadow-blue-500/30'
                                            : 'bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/80'
                                    }`}
                                    onClick={() => (window.location.href = '/dashboard')}
                                >
                                    <span className="relative z-10 flex items-center gap-2 font-medium">
                                        Go to Dashboard
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </span>
                                    <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </button>
                            ) : (
                                <>
                                    <button
                                        className={`group relative px-6 py-2 rounded-xl font-semibold text-lg tracking-wide transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 ${
                                            isDark
                                                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-600 text-white hover:from-green-600 hover:to-green-700 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/30'
                                                : 'bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-green-100 hover:to-green-600 hover:shadow-xl hover:shadow-green/30'
                                        }`}
                                        onClick={() => (window.location.href = '/register')}
                                    >
                                        <span className="relative z-10 flex items-center gap-1 font-medium">
                                            Register Now
                                        </span>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    </button>
                                    
                                    <button
                                        className={`group relative px-6 py-2 rounded-xl font-semibold text-lg tracking-wide transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 ${
                                            isDark
                                                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-600 text-white hover:from-green-600 hover:to-green-700 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/30'
                                                : 'bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-green-100 hover:to-green-600 hover:shadow-xl hover:shadow-green/30'
                                        }`}
                                        onClick={() => (window.location.href = '/login')}
                                    >
                                        <span className="relative z-10 flex items-center gap-2 font-medium">
                                            Sign In
                                        </span>
                                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
};

export default Dashboard;