import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

const NotFound = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md transition-all duration-300 ${
          theme === "dark"
            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
        }`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <h1
        className={`text-6xl font-bold mb-4 ${
          theme === "dark" ? "text-yellow-400" : "text-blue-700"
        }`}
      >
        404
      </h1>
      <p
        className={`text-2xl mb-8 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Page Not Found
      </p>
      <button
        onClick={() => navigate("/")}
        className={`px-6 py-3 font-semibold rounded-md shadow-md transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
            : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
        }`}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
