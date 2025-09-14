import React from "react";
import { languageOptions } from "../constants/languages";
import { X, Play, Plus, Code2, Zap } from 'lucide-react';

const ControlsPanel = ({
  width,
  isDarkmode,
  userLang,
  setUserLang,
  userInput,
  setUserInput,
  userOutput,
  loading,
  runCode,
  setUserCode,
}) => {
  const addTestCase = () => {
    if (userInput.length < 10) {
      setUserInput([...userInput, ""]);
    }
  };

  const deleteTestCase = (index) => {
    if (userInput.length > 1) {
      setUserInput(userInput.filter((_, i) => i !== index));
    }
  };

  const handleTestCaseChange = (e, index) => {
    const updatedInputs = [...userInput];
    updatedInputs[index] = e.target.value;
    setUserInput(updatedInputs);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = languageOptions.find(opt => opt.value === e.target.value);
    setUserLang(selectedLang);
    // Load boilerplate code for the selected language
    setUserCode(selectedLang.boilerplate);
  };

  return (
    <div className="flex flex-col flex-grow p-6 space-y-6 overflow-hidden" style={{ width }}>
      {/* Language Selection */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-blue-500" />
          <label htmlFor="languageSelect" className="font-semibold text-lg">Language:</label>
        </div>
        <select
          id="languageSelect"
          value={userLang.value}
          onChange={handleLanguageChange}
          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkmode 
              ? "bg-gray-800 border-gray-600 text-white hover:border-gray-500" 
              : "bg-white border-gray-300 text-gray-800 hover:border-gray-400"
          }`}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Test Cases Management */}
      <div className="flex flex-col space-y-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-lg">Test Cases</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={addTestCase}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-md"
              title="Add Test Case"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
            <button
              onClick={runCode}
              disabled={loading}
              title="Run All (Ctrl + ↵)"
              className={`flex items-center space-x-2 px-4 py-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md ${
                isDarkmode 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{loading ? "Running..." : "Run All"}</span>
            </button>
          </div>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-2 no-scrollbar">
          {userInput.map((testCase, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-72 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                isDarkmode 
                  ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Test Case {index + 1}</span>
                {userInput.length > 1 && (
                  <button
                    onClick={() => deleteTestCase(index)}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 hover:shadow-md"
                    aria-label="Delete test case"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <textarea
                value={testCase}
                onChange={(e) => handleTestCaseChange(e, index)}
                className={`w-full h-24 p-3 rounded-lg border-2 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkmode 
                    ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500" 
                    : "bg-gray-50 text-black border-gray-300 focus:border-blue-500"
                }`}
                placeholder={`Enter input for test case ${index + 1}...`}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ControlsPanel;
