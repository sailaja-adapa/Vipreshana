import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar'; // Import Navbar
import PageMeta from './components/Pagemeta';
const lightLocationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

const darkLocationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png', // Dark theme icon
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

const UserLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState('');
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                        await fetchAddress(latitude, longitude);
                    },
                    (err) => {
                        console.error('Geolocation error:', err);
                        setError(err.message);
                    },
                    {
                        enableHighAccuracy: true,
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        const fetchAddress = async (latitude, longitude) => {
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                setAddress(response.data.display_name || 'Address not found');
            } catch (error) {
                console.error('Error fetching address:', error);
                setError('Could not fetch address');
            }
        };

        fetchLocation();
    }, []);

    if (error) {
        return (
            <>
                <Navbar />
                <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                    <div className={`p-6 rounded-lg shadow-lg ${
                        theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
                    }`}>
                        <h2 className="text-xl font-bold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </>
        );
    }

    if (!location) {
        return (
            <>
                <Navbar />
                <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                    <div className={`p-6 rounded-lg shadow-lg ${
                        theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
                    }`}>
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <p className="text-lg">Loading location...</p>
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
            <div
                className="min-h-screen transition-all duration-300"
                style={{
                    backgroundImage: theme === 'light'
                        ? 'url(https://t3.ftcdn.net/jpg/07/96/85/70/240_F_796857006_a8aZyOVtPFaEPbbqGugGq88kkDlSLO1B.jpg)'
                        : 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '20px',
                }}
            >
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 shadow-lg ${
                        theme === 'dark'
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                            : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    }`}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <div className={`max-w-4xl mx-auto p-6 rounded-lg shadow-xl mt-10 transition-all duration-300 ${
                    theme === 'dark'
                        ? 'bg-gray-800 border-4 border-gray-600'
                        : 'bg-white border-4 border-black'
                }`}>
                    <div className="text-center mb-6">
                        <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                            Driver Location
                        </h1>
                        <div className="mt-4 space-y-2">
                            <div className={`p-3 rounded-lg transition-all duration-300 ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <p className={`text-lg transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    <strong className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>
                                        Latitude:
                                    </strong> {location.latitude.toFixed(6)}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg transition-all duration-300 ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <p className={`text-lg transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    <strong className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>
                                        Longitude:
                                    </strong> {location.longitude.toFixed(6)}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg transition-all duration-300 ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <p className={`text-lg transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    <strong className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>
                                        Address:
                                    </strong> {address}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                        theme === 'dark' ? 'border-2 border-gray-600' : 'border-2 border-gray-200'
                    }`}>
                        <MapContainer
                            center={[location.latitude, location.longitude]}
                            zoom={13}
                            style={{ height: '400px', width: '100%' }}
                            className="rounded-lg"
                        >
                            <TileLayer
                                url={theme === 'dark'
                                    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                }
                                attribution={theme === 'dark'
                                    ? '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                }
                            />
                            <Marker
                                position={[location.latitude, location.longitude]}
                                icon={theme === 'dark' ? darkLocationIcon : lightLocationIcon}
                            >
                                <Popup className={theme === 'dark' ? 'dark-popup' : ''}>
                                    <div className={theme === 'dark' ? 'text-gray-800' : 'text-gray-900'}>
                                        <strong>You are here!</strong> <br />
                                        <span className="text-sm">{address}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Additional Info Section */}
                    <div className={`mt-6 p-4 rounded-lg transition-all duration-300 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                    }`}>
                        <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                            📍 Location Details
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Real-time GPS coordinates are displayed above. The map shows your current location with high accuracy.
                            {theme === 'dark' ? ' Dark mode provides better visibility for night driving.' : ' Light mode is optimized for daytime use.'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserLocation;