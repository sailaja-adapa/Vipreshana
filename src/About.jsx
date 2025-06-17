import React from 'react';
import { useTheme } from './context/ThemeContext';
import Footer from './components/Footer';

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
  className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
    isDark
      ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white'
      : 'bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900'
  }`}
>
  {/* Main content wrapper */}
  <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
    {/* Title */}
    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
      Empowering Smarter Deliveries with Vipreshana 🚛✨
    </h1>
    <p className="text-center max-w-xl text-lg mb-12">
      From real-time tracking to complaint resolution, we're building a connected delivery ecosystem that just works.
    </p>

    {/* Feature Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {[
        {
          icon: '📍',
          title: 'Live Tracking',
          desc: 'Track your delivery’s exact location in real-time. No more wondering where your package is.',
        },
        {
          icon: '💬',
          title: 'Instant Alerts',
          desc: 'Stay updated with SMS notifications and status changes every step of the way.',
        },
        {
          icon: '📦',
          title: 'Smart Complaints',
          desc: 'Raise and resolve issues with automated status flows and admin tracking.',
        },
        {
          icon: '🤝',
          title: 'Trusted Drivers',
          desc: 'All drivers are verified and rated — ensuring reliable service and peace of mind.',
        },
        {
          icon: '📊',
          title: 'Role-Based Dashboards',
          desc: 'Separate control panels for users, drivers, and admins to manage things easily.',
        },
        {
          icon: '⚡',
          title: 'Fast & Transparent',
          desc: 'We keep you in control and your goods in motion — with speed and accountability.',
        },
      ].map((feature, i) => (
        <div
          key={i}
          className={`p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
            isDark ? 'bg-white/10' : 'bg-white'
          }`}
        >
          <div className="text-4xl mb-3">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>

    {/* Mission Section */}
    <div className="mt-16 max-w-3xl text-center">
      <h2 className="text-2xl font-bold mb-4">Our Mission 🌍</h2>
      <p className="text-lg leading-relaxed">
        We’re not just delivering goods — we’re delivering trust, visibility, and speed. Vipreshana is on a mission to
        bring logistics into the modern era through smart tech, transparent systems, and user-first experiences.
      </p>
    </div>

    {/* Call-to-action */}
    <div className="mt-12">
      <button
        className={`px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 ${
          isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        Explore How It Works
      </button>
    </div>
  </main>

  {/* Sticky Footer at the bottom */}
  <Footer />
</div>

  );
};

export default About;
