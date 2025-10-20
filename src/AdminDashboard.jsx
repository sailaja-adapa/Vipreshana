import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaCar, FaBus, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useTheme } from './context/ThemeContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [vehicleBreakdown, setVehicleBreakdown] = useState({ van: 0, bus: 0, car: 0 });
  const [statusData, setStatusData] = useState({
    labels: ['Picked Goods', 'En route to pickup'],
    datasets: [{ label: 'Booking Status', data: [0, 0], backgroundColor: ['#4CAF50', '#FF9800'] }],
  });

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://vipreshana-3.onrender.com/api/details');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update statusData and vehicleBreakdown whenever users change
  useEffect(() => {
    const vehicleCount = { van: 0, bus: 0, car: 0 };
    let pickedGoodsCount = 0;
    let enRouteCount = 0;

    users.forEach(user => {
      if (user.vehicleType === 'Van') vehicleCount.van += 1;
      if (user.vehicleType === 'Bus') vehicleCount.bus += 1;
      if (user.vehicleType === 'Car') vehicleCount.car += 1;

      if (user.status === 'Picked Goods') pickedGoodsCount += 1;
      if (user.status === 'En route to pickup') enRouteCount += 1;
    });

    setVehicleBreakdown(vehicleCount);

    setStatusData({
      labels: ['Picked Goods', 'En route to pickup'],
      datasets: [
        {
          label: 'Booking Status',
          data: [pickedGoodsCount, enRouteCount],
          backgroundColor: ['#4CAF50', '#FF9800'],
          hoverBackgroundColor: ['#388E3C', '#F57C00'],
        },
      ],
    });
  }, [users]);

  const vehicleStatusData = {
    labels: ['Van', 'Bus', 'Car'],
    datasets: [
      {
        label: 'Vehicle Type Breakdown',
        data: [vehicleBreakdown.van, vehicleBreakdown.bus, vehicleBreakdown.car],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
        hoverBackgroundColor: ['#388E3C', '#F57C00', '#1976D2'],
      },
    ],
  };

  return (
    <div
      className={`p-4 min-h-screen transition-all duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full z-10 ${
          isDark ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
        }`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className="max-w-5xl mx-auto p-6 bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

        {/* Users Table */}
        <div className="p-4 rounded-lg shadow-md mb-8 bg-opacity-90">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2"></th>
                <th className="border px-4 py-2">👤 Name</th>
                <th className="border px-4 py-2">📞 Phone</th>
                <th className="border px-4 py-2">🚗 Vehicle Type</th>
                <th className="border px-4 py-2">✅ Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    {user.status === 'Picked Goods' ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaClock className="text-orange-600" />
                    )}
                  </td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.phone}</td>
                  <td className="border px-4 py-2">{user.vehicleType}</td>
                  <td className="border px-4 py-2">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking Status Pie */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-center mb-4">User Booking Status Breakdown</h2>
          <div className="w-full md:w-1/2 h-72 mx-auto">
            <Pie
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
          <ul className="flex justify-center space-x-6 mt-4">
            <li className="flex items-center">
              <FaCheckCircle className="text-green-600 mr-2" />
              Picked Goods: {statusData.datasets[0].data[0]}
            </li>
            <li className="flex items-center">
              <FaClock className="text-orange-600 mr-2" />
              En route to pickup: {statusData.datasets[0].data[1]}
            </li>
          </ul>
        </div>

        {/* Vehicle Breakdown */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-center mb-4">Vehicle Type Breakdown</h2>
          <div className="w-full md:w-1/2 h-72 mx-auto">
            <Pie
              data={vehicleStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
