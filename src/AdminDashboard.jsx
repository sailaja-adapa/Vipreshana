import React from 'react';
import { useTheme } from './context/ThemeContext';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar'; // Import the Navbar
import PageMeta from './components/Pagemeta';
const AdminDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
    <PageMeta /> 
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`p-4 min-h-screen bg-cover bg-center transition-all duration-300 ${
          isDark ? 'brightness-75' : 'brightness-100'
        }`}
        style={{
          backgroundImage:
            'url(https://img.freepik.com/free-vector/graph-chart-with-moving-up-arrow-stock-market-financial-investment-diagram-blue-background_56104-1814.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className={`p-8 rounded-xl shadow-md ${
            isDark ? 'bg-black bg-opacity-80 text-white' : 'bg-white bg-opacity-80 text-black'
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard 📊</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg shadow bg-opacity-50 bg-blue-500 text-white">
              <h3 className="text-xl font-semibold mb-2">Total Users</h3>
              <p className="text-2xl font-bold">1,240</p>
            </div>

            <div className="p-4 rounded-lg shadow bg-opacity-50 bg-green-500 text-white">
              <h3 className="text-xl font-semibold mb-2">Active Bookings</h3>
              <p className="text-2xl font-bold">320</p>
            </div>

            <div className="p-4 rounded-lg shadow bg-opacity-50 bg-yellow-500 text-white">
              <h3 className="text-xl font-semibold mb-2">Complaints</h3>
              <p className="text-2xl font-bold">15</p>
            </div>

            <div className="p-4 rounded-lg shadow bg-opacity-50 bg-red-500 text-white">
              <h3 className="text-xl font-semibold mb-2">Pending Approvals</h3>
              <p className="text-2xl font-bold">7</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AdminDashboard;