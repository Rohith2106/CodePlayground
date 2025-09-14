// src/components/Header.jsx
import React from "react";
import { Code2, Sun, Moon, Zap } from "lucide-react";

const Header = ({ isDarkmode, toggleTheme }) => (
  <header className={`p-4 flex justify-between items-center border-b-2 transition-all duration-200 ${
    isDarkmode 
      ? "bg-gray-900 border-gray-700" 
      : "bg-white border-gray-200"
  }`}>
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Code2 className="w-8 h-8 text-blue-500" />
        <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          CodeRunner
        </h1>
      </div>
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
        <Zap className="w-4 h-4" />
        <span>Live</span>
      </div>
    </div>
    
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg">
        <button
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
            !isDarkmode 
              ? "bg-white text-gray-800 shadow-sm" 
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={toggleTheme}
          disabled={!isDarkmode}
          aria-label="Switch to Light Theme"
        >
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium">Light</span>
        </button>
        <button
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
            isDarkmode 
              ? "bg-gray-700 text-white shadow-sm" 
              : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={toggleTheme}
          disabled={isDarkmode}
          aria-label="Switch to Dark Theme"
        >
          <Moon className="w-4 h-4" />
          <span className="text-sm font-medium">Dark</span>
        </button>
      </div>
    </div>
  </header>
);

export default Header;