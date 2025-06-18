import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="py-6 px-4 md:px-12 bg-gray-800 text-gray-300">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <p className="text-sm">&copy; {new Date().getFullYear()} Vipreshana. All rights reserved.</p>
                <div className="flex space-x-6 text-xl">
                    <a
                        href="https://github.com/sailaja-adapa/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200"
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/sailaja-adapa-770167291/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200"
                    >
                        <FaLinkedin />
                    </a>
                    <a
                        href="mailto:adapasailaja17@gmail.com"
                        className="hover:text-white transition-colors duration-200"
                    >
                        <FaEnvelope />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
