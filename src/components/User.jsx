import React, { useState, useEffect, useCallback } from 'react';
import Footer from './Footer';
import { Sun, Moon, Car, Truck, Bus, MapPin, User, Phone, Calculator, Sparkles, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import Navbar from './Navbar'; // <-- Import your Navbar component!

const API_BASE_URL = 'https://vipreshana-3.onrender.com';

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const cityCoordinates = {
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBaseCost = (vehicleType) => {
  const costMap = {
    Car: 10,
    Van: 15,
    Bus: 20,
  };
  return costMap[vehicleType] || 10;
};

const TransportBooking = () => {
  // Remove local theme state, Navbar will handle theme toggle
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [cities, setCities] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // You can optionally use a theme context if you want dark/light mode to be global
  // For now, we'll keep this simple and use default light theme styles

  useEffect(() => {
    setCities(Object.keys(cityCoordinates));
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const calculateCost = useCallback((pickup, dropoff, vehicle) => {
    if (!pickup || !dropoff || !vehicle) {
      setEstimatedCost(null);
      return;
    }

    setCalculating(true);
    try {
      const pickupCoords = cityCoordinates[pickup];
      const dropoffCoords = cityCoordinates[dropoff];

      if (!pickupCoords || !dropoffCoords) {
        throw new Error("Invalid city locations");
      }

      const distance = haversineDistance(
        pickupCoords.lat,
        pickupCoords.lon,
        dropoffCoords.lat,
        dropoffCoords.lon
      );

      const cost = Math.round(getBaseCost(vehicle) * distance);
      setEstimatedCost(cost);
    } catch (error) {
      setEstimatedCost(null);
      showToast("Failed to estimate cost. Check locations.", "error");
    } finally {
      setCalculating(false);
    }
  }, []);

  const debouncedCalculateCost = useCallback(
    debounce((pickup, dropoff, vehicle) => {
      calculateCost(pickup, dropoff, vehicle);
    }, 700),
    [calculateCost]
  );

  useEffect(() => {
    debouncedCalculateCost(pickupLocation, dropoffLocation, vehicleType);
  }, [pickupLocation, dropoffLocation, vehicleType, debouncedCalculateCost]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setPickupLocation('');
    setDropoffLocation('');
    setVehicleType('');
    setEstimatedCost(null);
  };

  const handleBooking = async () => {
    if (!name || !phone || !pickupLocation || !dropoffLocation || !vehicleType) {
      showToast('Please fill all fields', 'error');
      return;
    }

    setLoading(true);

    try {
      if (estimatedCost !== null) {
        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            phone,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            estimatedCost,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to save booking');
        }

        showToast('Thanks for booking! Your ride is confirmed 🚗', 'success');
        resetForm();
      } else {
        showToast('Error: Please select valid locations and vehicle type.', 'error');
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Car': return <Car className="w-5 h-5" />;
      case 'Van': return <Truck className="w-5 h-5" />;
      case 'Bus': return <Bus className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const getVehicleBadgeColor = (type) => {
    switch (type) {
      case 'Car': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Van': return 'bg-green-100 text-green-800 border-green-200';
      case 'Bus': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Set light as default, but if you want global theme, use context/provider
  const isDark = false;

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
    } flex items-center justify-center p-4 sm:p-6 lg:p-8`}>
      
      <Navbar /> {/* Render Navbar at the top */}

      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 backdrop-blur-sm ${
          toast.type === 'success' 
            ? 'bg-green-50/90 text-green-800 border border-green-200' 
            : 'bg-red-50/90 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDark 
            ? 'bg-gradient-to-br from-blue-600/20 to-purple-800/20' 
            : 'bg-gradient-to-br from-blue-400/20 to-purple-600/20'
        }`}></div>
        <div className={`absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDark 
            ? 'bg-gradient-to-tr from-cyan-600/20 to-blue-800/20' 
            : 'bg-gradient-to-tr from-cyan-400/20 to-blue-600/20'
        }`} style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-6 sm:p-8 lg:p-12 ${
          isDark
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-white/80 border-white/20'
        }`}>
          
          <div className="text-center mb-8 relative">
            {/* Remove theme toggle button, Navbar handles theme */}
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              <Navigation className="w-8 h-8 text-white" />
            </div>
            
            <h1 className={`text-2xl sm:text-4xl font-bold mb-2 ${
              isDark
                ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'
            }`}>
              Book Your Ride
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Fast, reliable transportation at your fingertips
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                   isDark 
                      ? 'bg-gray-700/50 border-gray-600/50 hover:text-white placeholder-gray-400 hover:bg-gray-700 text-gray-600' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600/50 hover:text-white placeholder-gray-400 hover:bg-gray-700 text-gray-600' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <MapPin className="w-4 h-4 text-green-500" />
                  Pickup Location
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600/50 hover:text-white placeholder-gray-400 hover:bg-gray-700 text-gray-600' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white'
                  }`}
                >
                  <option value="">Select pickup location</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`flex items-center gap-2 text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <MapPin className="w-4 h-4 text-red-500" />
                  Drop-off Location
                </label>
                <select
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600/50 hover:text-white placeholder-gray-400 hover:bg-gray-700 text-gray-600' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white'
                  }`}
                >
                  <option value="">Select drop-off location</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-4">
              <label className={`flex items-center gap-2 text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Car className="w-4 h-4" />
                Vehicle Type
              </label>
              <div className="relative">
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600/50 hover:text-white placeholder-gray-400 hover:bg-gray-700 text-gray-600' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white'
                  }`}
                >
                  <option value="">Choose your vehicle</option>
                  <option value="Car">🚗 Car - Comfortable & Quick</option>
                  <option value="Van">🚐 Van - Spacious & Reliable</option>
                  <option value="Bus">🚌 Bus - Group Travel</option>
                </select>
                {vehicleType && (
                  <div className={`absolute right-12 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${
                    isDark ? 'bg-gray-600 border-gray-500 text-gray-200' : getVehicleBadgeColor(vehicleType)
                  }`}>
                    {getVehicleIcon(vehicleType)}
                    <span>{vehicleType}</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`rounded-xl p-6 border ${
              isDark
                ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800/30'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Estimated Cost
                  </span>
                </div>
                <div className="text-right">
                  {calculating ? (
                    <div className={`flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Calculating...</span>
                    </div>
                  ) : (
                    <div className={`text-2xl font-bold ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ₹{estimatedCost !== null ? estimatedCost.toLocaleString() : '0'}
                    </div>
                  )}
                </div>
              </div>
            </div>

 
            <button
              onClick={handleBooking}
              disabled={loading || calculating}
              className={`w-full p-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] ${
                isDark
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Booking Your Ride...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Book Now
                </div>
              )}
            </button>
          </div>
        </div>


        <div className="text-center mt-6">
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Safe, reliable transportation • Available 24/7 • Trusted by thousands
           
            
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default TransportBooking;