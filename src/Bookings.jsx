import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Footer from './components/Footer';



const UserBookings = () => {
  const [theme, setTheme] = useState('light');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBookings = async () => {
      const phone = localStorage.getItem("userPhone"); // Get phone number from localStorage

      if (!phone) {
        setError("Phone number not found in local storage");
        return;
      }

      try {
        const response = await fetch(
          `https://vipreshana-3.onrender.com/api/bookings/${phone}`
        ); // Call backend API with phone number
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const bookingsData = await response.json();
        setBookings(bookingsData); // Set fetched bookings data
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };

    fetchUserBookings();
  }, []);

  const handleTrackDriver = (bookingId) => {
    localStorage.setItem("bookingId", bookingId); // Store booking ID in localStorage
    navigate("/location"); // Navigate to the Location component
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDarkMode = theme === 'dark';
  return (
    <div
      className={`min-h-screen flex flex-col transition-all-500 ${isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
          : 'bg-gradient-to-t from-yellow-200 to-blue-100'
        } flex items-center justify-center p-4 sm:p-6 lg:p-8`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-10 p-3 rounded-full shadow-lg transition-all duration-300 text-center ${isDarkMode
            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            : "bg-black text-white hover:bg-gray-800"
          }`}
        title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
         <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className={`backdrop-blur-sm ${isDarkMode ? "bg-gray-800 bg-opacity-80" : "bg-gray-100 bg-opacity-70"
          } rounded-lg p-8 shadow-xl max-w-7xl w-full border-4 ${isDarkMode ? "border-gray-600" : "border-black"
          } overflow-x-auto transition-all duration-300`}
      >
        <h1
          className={`text-4xl font-extrabold text-center ${isDarkMode ? "text-gray-100" : "text-gray-900"
            } mb-6`}
        >
          Your Bookings
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {bookings.length === 0 ? (
          <p
            className={`text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            No bookings found.
          </p>
        ) : (
          <table
            className={`w-full table-auto text-left  border-spacing-y-2 border-2 ${isDarkMode ? "border-gray-600" : "border-black"
              }`}
          >
            <thead>
              <tr
                className={`${isDarkMode
                    ? "bg-gray-700 bg-opacity-80 text-gray-200"
                    : "bg-gray-300 bg-opacity-80 text-gray-800"
                  }`}
              >
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  #
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Name
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Phone
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Pickup Location
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Drop-off Location
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Vehicle Type
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Cost
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Created At
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                >
                  Track
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id} // Assuming MongoDB ObjectId is used
                  className={`${isDarkMode
                      ? "bg-gray-800 bg-opacity-90"
                      : "bg-white bg-opacity-90"
                    } border-b shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 rounded-lg`}
                  style={{
                    borderBottom: isDarkMode
                      ? "2px solid #4B5563"
                      : "2px solid black",
                  }}
                >
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                  >
                    {index + 1}
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {booking.name}
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {booking.phone}
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {booking.pickupLocation}
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {booking.dropoffLocation}
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {booking.vehicleType}
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    {booking.estimatedCost.toFixed(2)} INR
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                  >
                    {new Date(booking.bookingDate).toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      }`}
                  >
                    <span
                      className={`font-bold ${booking.status === "pending"
                          ? "text-red-500"
                          : "text-green-500"
                        }`}
                    >
                      {booking.status === "pending"
                        ? "Pending"
                        : booking.status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"
                      } text-center`}
                  >
                    {booking.status === "pending" ? (
                      <span className="text-yellow-500 font-bold">Pending</span>
                    ) : (
                      <button
                        className={`${isDarkMode
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-blue-500 hover:bg-blue-600"
                          } text-white py-2 px-4 rounded transition duration-300`}
                        onClick={() => handleTrackDriver(booking._id)} // Call the new function to handle tracking
                      >
                        Track Driver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </main>
     <Footer/>
    </div>
  );
};

export default UserBookings;
