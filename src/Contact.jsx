import React, { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';

import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';

const contacts = [
  {
    name: 'GitHub',
    url: 'https://github.com/sailaja-adapa/',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184..." />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sailaja-adapa-770167291/',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76..." />
      </svg>
    )
  },
  {
    name: 'Email',
    url: 'adapasailaja17@gmail.com',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1..." />
      </svg>
    )
  }
];

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <PageMeta />
      <Navbar />
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700 font-inter relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700'
          : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'
      }`}>
        <div className={`relative shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center transition-all duration-1000 transform backdrop-blur-sm ${
          isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        } ${isDark ? 'bg-gray-900/90 border border-gray-700' : 'bg-white/90 border border-white/50'}`}>
          <h1 className={`text-5xl font-bold mb-2 bg-clip-text leading-tight ${
            isDark
              ? 'text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500'
              : 'text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500'
          }`}>
            Contact Us
          </h1>

          <p className={`mb-10 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            We'd love to hear from you! Reach out to us via any of the platforms below:
          </p>

          <div className="flex justify-center gap-7 mb-7">
            {contacts.map((contact, index) => (
              <div
                key={contact.name}
                className={`transition-all duration-1000 transform ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
              >
                <a
                  href={contact.name === 'Email' ? `mailto:${contact.url}` : contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-4 rounded-2xl transition-transform duration-300 hover:scale-110 ${
                    isDark 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="mb-2">{contact.icon}</div>
                  <span className="text-sm font-semibold">{contact.name}</span>
                </a>
              </div>
            ))}
          </div>

          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Let's build something amazing together!
          </p>
        </div>
      </div>
      
    </>
  );
};

export default Contact;
