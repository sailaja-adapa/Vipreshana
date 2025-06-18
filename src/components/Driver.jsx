import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar'; // <-- IMPORT NAVBAR!
import { User, Phone, MapPin, Navigation, Package, DollarSign, Truck, Clock, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'https://vipreshana-3.onrender.com';

const Driver = () => {
    const [bookings, setBookings] = useState([]);
    const [acceptedBooking, setAcceptedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [jobStatus, setJobStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme(); // No need for toggleTheme here

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/details`);
                setBookings(response.data); 
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleAcceptBooking = async (booking) => {
        const confirmAccept = window.confirm("Are you sure you want to accept this booking?");
        if (!confirmAccept) {
            toast.info('Booking acceptance canceled.');
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/api/details/${booking._id}/accept`, {
                accepted_booking: 'accepted'
            });
            setAcceptedBooking(booking);
            setShowDetails(true);
            setJobStatus(booking.status);
            toast.success('Booking accepted successfully!');
            setBookings(prevBookings =>
                prevBookings.map(b =>
                    b._id === booking._id ? { ...b, accepted_booking: 'accepted' } : b
                )
            );
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast.error('Failed to accept booking.');
        }
    };

    const toggleDetails = (booking) => {
        if (acceptedBooking && acceptedBooking._id === booking._id) {
            setShowDetails(!showDetails);
        } else {
            setAcceptedBooking(booking);
            setShowDetails(true);
            setJobStatus(booking.status);
        }
    };

    const handleUpdateStatus = async (status) => {
        setJobStatus(status);
        try {
            await axios.put(`${API_BASE_URL}/api/details/${acceptedBooking._id}/status`, { status });
            setAcceptedBooking(prevBooking => ({ ...prevBooking, status }));
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === acceptedBooking._id ? { ...booking, status } : booking
                )
            );
            toast.success('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status.');
        }
    };

    const handleDelivery = async () => {
        const confirmDelivery = window.confirm("Are you sure you want to mark this booking as delivered?");
        if (!confirmDelivery) return;
    
        try {
            // Mark as delivered
            await axios.put(`${API_BASE_URL}/api/details/${acceptedBooking._id}/status`, { status: 'Delivered' });
            
            // Send delivery message
            await axios.post(`${API_BASE_URL}/api/details/deliver`, {
                phone: acceptedBooking.phone,
                message: `Dear ${acceptedBooking.name}, Your goods have been delivered from ${acceptedBooking.pickupLocation} to ${acceptedBooking.dropoffLocation} safely.`
            });
    
            // Delete the booking from the database
            await axios.delete(`${API_BASE_URL}/api/details/${acceptedBooking._id}`);
    
            // Update state to remove the delivered booking
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== acceptedBooking._id));
            setAcceptedBooking(null);
            setShowDetails(false);
            toast.success('Delivery message sent and booking removed from database.');
        } catch (error) {
            console.error('Error delivering booking:', error);
            toast.error('Failed to send delivery message or delete booking.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Enroute to Pick up': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Picked Goods': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Enroute to Pick up': return <Navigation className="w-4 h-4" />;
            case 'Picked Goods': return <Package className="w-4 h-4" />;
            case 'Delivered': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const isDark = theme === 'dark';
    
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
                isDark ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-all duration-300 ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <Navbar /> {/* RENDER NAVBAR HERE */}

            {/* Hero Section with Background Image */}
            <div 
                className="relative h-80 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: 'url(https://images.unsplash.com/photo-1547628641-ec2098bb5812?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8fA%3D%3D)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
                <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-6">
                    <div>
                        <h1 className="text-5xl font-bold mb-4">Driver Dashboard</h1>
                        <p className="text-xl opacity-90">Manage your delivery assignments efficiently</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-6 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 -mt-20 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className={`p-6 rounded-2xl shadow-xl border-2 transform hover:scale-105 transition-all duration-300 ${
                            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-blue-100 text-gray-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Total Bookings
                                    </p>
                                    <p className="text-3xl font-bold mt-2">{bookings.length}</p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-full">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-6 rounded-2xl shadow-xl border-2 transform hover:scale-105 transition-all duration-300 ${
                            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-green-100 text-gray-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Accepted Jobs
                                    </p>
                                    <p className="text-3xl font-bold mt-2">
                                        {bookings.filter(b => b.accepted_booking === 'accepted').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-6 rounded-2xl shadow-xl border-2 transform hover:scale-105 transition-all duration-300 ${
                            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-yellow-100 text-gray-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Pending Jobs
                                    </p>
                                    <p className="text-3xl font-bold mt-2">
                                        {bookings.filter(b => b.accepted_booking !== 'accepted').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-500 rounded-full">
                                    <Clock className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bookings List */}
                    {bookings.length > 0 ? (
                        <div className="space-y-6">
                            {bookings.map((booking, index) => (
                                <div 
                                    key={booking._id}
                                    className={`rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-700 text-white' 
                                            : 'bg-white border-gray-200 text-gray-800'
                                    }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Booking Header */}
                                    <div className="p-6 border-b border-gray-200/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold">Booking Details</h3>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Pickup Location
                                                    </p>
                                                    <p className="text-sm font-medium">{booking.pickupLocation}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <Navigation className="w-5 h-5 text-red-500" />
                                                <div>
                                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Drop-off Location
                                                    </p>
                                                    <p className="text-sm font-medium">{booking.dropoffLocation}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Estimated Cost
                                                    </p>
                                                    <p className="text-sm font-bold text-green-600">{booking.estimatedCost}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <Truck className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Vehicle Type
                                                    </p>
                                                    <p className="text-sm font-medium">{booking.vehicleType}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-6">
                                        {booking.accepted_booking === 'accepted' ? (
                                            <button
                                                onClick={() => toggleDetails(booking)}
                                                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                                                    isDark
                                                        ? 'bg-gray-700 hover:bg-gray-600 text-white hover:shadow-lg'
                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow-lg'
                                                } hover:scale-[1.02]`}
                                            >
                                                {showDetails && acceptedBooking && acceptedBooking._id === booking._id 
                                                    ? "Hide Details" : "View Details"}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAcceptBooking(booking)}
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
                                            >
                                                Accept
                                            </button>
                                        )}
                                    </div>

                                    {/* Job Details Panel */}
                                    {acceptedBooking && acceptedBooking._id === booking._id && showDetails && (
                                        <div className={`mx-6 mb-6 p-6 rounded-xl border-2 border-dashed transition-all duration-300 ${
                                            isDark 
                                                ? 'border-gray-600 bg-gray-900/50' 
                                                : 'border-gray-300 bg-gray-50/80'
                                        }`}>
                                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                Job Assignment:
                                            </h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-5 h-5 text-blue-500" />
                                                    <div>
                                                        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Name
                                                        </p>
                                                        <p className="text-sm font-medium">{acceptedBooking.name}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-5 h-5 text-green-500" />
                                                    <div>
                                                        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Phone number
                                                        </p>
                                                        <p className="text-sm font-medium">{acceptedBooking.phone}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={() => handleUpdateStatus('Enroute to Pick up')}
                                                    className="flex-1 min-w-[150px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                                                >
                                                    Enroute to Pick up
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleUpdateStatus('Picked Goods')}
                                                    className="flex-1 min-w-[150px] bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                                                >
                                                    Picked Goods
                                                </button>
                                                
                                                <button
                                                    onClick={handleDelivery}
                                                    className="flex-1 min-w-[150px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                                                >
                                                    Delivered
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-16 rounded-2xl shadow-xl border-2 ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700 text-gray-300' 
                                : 'bg-white border-gray-200 text-gray-600'
                        }`}>
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold mb-2">No bookings available</h3>
                            <p>New delivery requests will appear here when they become available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Driver;