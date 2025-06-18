import React, { useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { motion } from 'framer-motion';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';

const HowItWorks = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const steps = [
    {
      icon: '📱',
      title: 'Book Your Ride',
      description:
        'Choose your pickup and drop-off locations, select your preferred vehicle type, and get an instant price estimate.',
    },
    {
      icon: '🚗',
      title: 'Driver Assignment',
      description:
        'Our system automatically assigns the nearest available driver to your location for quick pickup.',
    },
    {
      icon: '📍',
      title: 'Real-time Tracking',
      description:
        'Track your delivery in real-time through our interactive map interface. Get live updates on driver location.',
    },
    {
      icon: '📦',
      title: 'Safe Delivery',
      description:
        'Our verified drivers ensure your goods are transported safely and delivered to your destination.',
    },
    {
      icon: '⭐',
      title: 'Rate & Review',
      description:
        'After delivery, rate your experience and provide feedback to help us improve our services.',
    },
  ];

  return (
    <>
      <PageMeta />
      <Navbar />
      <div
        className={`min-h-screen transition-all duration-300 ${
          isDark
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900'
        }`}
      >
        <div className="container mx-auto px-4 py-16">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-4xl md:text-5xl font-bold text-center mb-4 ${
              isDark ? 'text-blue-400' : 'text-gray-900'
            }`}
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg text-center max-w-2xl mx-auto mb-12 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Experience seamless logistics with our simple and efficient process.
            From booking to delivery, we've got you covered every step of the way.
          </motion.p>

          {/* Timeline Section */}
          <div className="relative max-w-4xl mx-auto">
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 h-full w-1 ${
                isDark
                  ? 'bg-blue-500'
                  : 'bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500'
              }`}
            ></div>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xl ${
                      isDark
                        ? 'bg-blue-500'
                        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? 'mr-auto pr-12' : 'ml-auto pl-12'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`p-6 rounded-xl shadow-lg ${
                        isDark ? 'bg-gray-800' : 'bg-white'
                      }`}
                    >
                      <h3
                        className={`text-xl font-semibold mb-2 ${
                          isDark ? 'text-blue-400' : 'text-gray-900'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = '/register')}
              className={`px-8 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-blue-500'
              }`}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HowItWorks;
