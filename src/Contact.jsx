import React, { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';
import Footer from './components/Footer';


import Navbar from './components/Navbar'; // Import Navbar
import PageMeta from './components/Pagemeta';
const contacts = [
  {
    name: 'GitHub',
    url: 'https://github.com/sailaja-adapa/',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" /></svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sailaja-adapa-770167291/',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z" /></svg>
    )
  },
  {
    name: 'Email',
    url: 'adapasailaja17@gmail.com',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z" /></svg>
    )
  }
];

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
return (
  <div className={`min-h-screen flex flex-col ${isDark
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700'
    : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'
  }`}>
    
    {/* Main content area grows to fill space */}
    <main className="flex-grow flex items-center justify-center p-4">
      <div className={`shadow-xl rounded-2xl p-8 max-w-md w-full text-center transition-colors duration-300 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'
        }`}>
        <h1 className={`text-4xl font-bold mb-4 bg-clip-text ${isDark
          ? 'text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
          : 'text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
          }`}>
          Contact Us
        </h1>
        <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>We'd love to hear from you! Reach out to us via any of the platforms below:</p>
        <div className="flex justify-center gap-8 mb-6">
          {contacts.map((contact) => (
            <a
              key={contact.name}
              href={contact.url.startsWith('mailto:') ? contact.url : contact.name === 'Email' ? `mailto:${contact.url}` : contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-transform transform hover:scale-110 ${isDark ? 'hover:text-pink-400 text-gray-200' : 'hover:text-pink-500 text-gray-700'
                }`}
              aria-label={contact.name}
            >
              {contact.icon}
              <span className="block mt-2 text-sm font-medium">{contact.name}</span>
            </a>
          ))}
        </div>
      </div>
    </main>

    {/* Footer stays at the bottom */}
    <Footer />
  </div>
);


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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-20 w-32 h-32 rounded-full opacity-20 animate-pulse ${
            isDark ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-pink-400 to-purple-400'
          }`}></div>
          <div className={`absolute top-1/3 right-16 w-24 h-24 transform rotate-45 opacity-30 animate-bounce ${
            isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-400 to-purple-400'
          }`} style={{ animationDuration: '3s' }}></div>
          <div className={`absolute bottom-32 left-16 w-20 h-20 rounded-full opacity-25 animate-pulse ${
            isDark ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-purple-400 to-pink-400'
          }`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute bottom-20 right-20 w-28 h-28 transform rotate-12 opacity-20 animate-bounce ${
            isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gradient-to-r from-cyan-400 to-blue-400'
          }`} style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        </div>

        <div className={`relative shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center transition-all duration-1000 transform backdrop-blur-sm ${
          isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        } ${isDark ? 'bg-gray-900/90 border border-gray-700' : 'bg-white/90 border border-white/50'}`}>
          <div className={`transition-all duration-1000 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
          }`} style={{ transitionDelay: '200ms' }}>
            <h1 className={`text-5xl font-bold mb-2 bg-clip-text leading-tight ${
              isDark
                ? 'text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500'
                : 'text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500'
            }`}>
              Contact Us
            </h1>
            <div className={`mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r ${
              isDark 
                ? 'from-blue-400 via-purple-400 to-pink-400' 
                : 'from-blue-500 via-purple-500 to-pink-500'
            } transition-all duration-1000 transform ${
              isLoaded ? 'scale-x-100' : 'scale-x-0'
            }`} style={{ transitionDelay: '400ms' }}></div>
          </div>

          <p className={`mb-10 text-lg leading-relaxed transition-all duration-1000 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          } ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          style={{ transitionDelay: '600ms' }}>
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
                  href={contact.url.startsWith('mailto:') ? contact.url : contact.name === 'Email' ? `mailto:${contact.url}` : contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-4 rounded-2xl transition-transform duration-300 hover:scale-110 ${
                    isDark 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  aria-label={contact.name}
                >
                  <div className="mb-2">
                    {contact.icon}
                  </div>
                  <span className="text-sm font-semibold">
                    {contact.name}
                  </span>
                </a>
              </div>
            ))}
          </div>

          <div className={`transition-all duration-1000 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`} style={{ transitionDelay: '1400ms' }}>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Let's build something amazing together!
            </p>
          </div>
        </div>

        <div className={`mt-8 transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} style={{ transitionDelay: '1600ms' }}>
          <div className="flex justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-blue-400' : 'bg-purple-500'
            }`}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-purple-400' : 'bg-pink-500'
            }`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-pink-400' : 'bg-blue-400'
            }`} style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
