import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import PageMeta from "./components/Pagemeta";
import Footer from "./components/Footer";

const API_BASE_URL = 'https://vipreshana-3.onrender.com';

const UserBookings = () => {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const phone = localStorage.getItem("userPhone");

        if (!phone || typeof phone !== "string" || phone.trim() === "") {
          setError("Phone number not found or invalid in local storage");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/bookings/${phone}`);

        if (response.status === 404) {
          setBookings([]);
          return;
        }

        if (!response.ok) {
          setError("Failed to fetch bookings. Please try again later.");
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          setError("Invalid booking data format received.");
          return;
        }

        setBookings(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong while fetching bookings.");
      }
    };

    fetchUserBookings();
  }, []);

  const handleTrackDriver = (bookingId) => {
    localStorage.setItem("bookingId", bookingId);
    navigate("/location");
  };

  return (
    <>
      <PageMeta />
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`min-h-screen transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
            : "bg-gradient-to-t from-yellow-200 to-blue-100"
        } flex flex-col justify-between p-4 sm:p-6 lg:p-8`}
      >
        <main className="flex-grow flex items-center justify-center">
          <div
            className={`backdrop-blur-sm ${
              isDarkMode ? "bg-gray-800 bg-opacity-80" : "bg-gray-100 bg-opacity-70"
            } rounded-lg p-8 shadow-xl max-w-7xl w-full border-4 ${
              isDarkMode ? "border-gray-600" : "border-black"
            } overflow-x-auto transition-all duration-300`}
          >
            <h1
              className={`text-4xl font-extrabold text-center ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-6`}
            >
              Your Bookings
            </h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {bookings.length === 0 ? (
              <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                No bookings found.
              </p>
            ) : (
              <table
                className={`w-full table-auto text-left border-spacing-y-2 border-2 ${
                  isDarkMode ? "border-gray-600" : "border-black"
                }`}
              >
                <thead>
                  <tr
                    className={`${
                      isDarkMode
                      ? "bg-gray-700 bg-opacity-80 text-gray-200"
                      : "bg-gray-300 bg-opacity-80 text-gray-800"
                    }`}
                  >
                    {["#", "Name", "Phone", "Pickup Location", "Drop-off Location", "Vehicle Type", "Cost", "Created At", "Status", "Track"].map((col, idx) => (
                      <th
                        key={idx}
                        className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`${
                        isDarkMode ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90"
                      } border-b shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105`}
                      style={{
                        borderBottom: isDarkMode ? "2px solid #4B5563" : "2px solid black",
                      }}
                    >
                      <td className={`px-6 py-4 border font-semibold ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-900 border-black"}`}>{index + 1}</td>
                      <td className={`px-6 py-4 border ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-900 border-black"}`}>{booking.name}</td>
                      <td className={`px-6 py-4 border ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-900 border-black"}`}>{booking.phone}</td>
                      <td className={`px-6 py-4 border ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-900 border-black"}`}>{booking.pickupLocation}</td>
                      <td className={`px-6 py-4 border ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-900 border-black"}`}>{booking.dropoffLocation}</td>
                      <td className={`px-6 py-4 border ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-900 border-black"}`}>{booking.vehicleType}</td>
                      <td className={`px-6 py-4 border font-semibold ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-800 border-black"}`}>{booking.estimatedCost.toFixed(2)} INR</td>
                      <td className={`px-6 py-4 border ${isDarkMode ? "text-gray-200 border-gray-600" : "text-gray-900 border-black"}`}>{new Date(booking.bookingDate).toLocaleString()}</td>
                      <td className={`px-6 py-4 border ${isDarkMode ? "border-gray-600" : "border-black"}`}>
                        <span className={`font-bold ${booking.status === "pending" ? "text-red-500" : "text-green-500"}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 border text-center ${isDarkMode ? "border-gray-600" : "border-black"}`}>
                        {booking.status === "pending" ? (
                          <span className="text-yellow-500 font-bold">Pending</span>
                        ) : (
                          <button
                            onClick={() => handleTrackDriver(booking._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
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
        <Footer />
      </motion.div>
    </>
  );
};

export default UserBookings;
