// src/components/OutputPanel.jsx

import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Terminal, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const OutputPanel = ({ userOutput, loading, isDarkmode }) => {
  const getOutputIcon = (output) => {
    if (output.toLowerCase().includes('error') || output.toLowerCase().includes('failed')) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else if (output.toLowerCase().includes('warning') || output.toLowerCase().includes('import')) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    } else {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getOutputStatus = (output) => {
    if (output.toLowerCase().includes('error') || output.toLowerCase().includes('failed')) {
      return 'error';
    } else if (output.toLowerCase().includes('warning') || output.toLowerCase().includes('import')) {
      return 'warning';
    } else {
      return 'success';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-base">Output</h3>
        </div>
        <div className="text-xs text-gray-500">
          {userOutput.length} result{userOutput.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-3">
            {userOutput.length === 0 ? (
              <div className={`flex items-center justify-center h-full rounded-lg border-2 border-dashed ${
                isDarkmode ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-400"
              }`}>
                <div className="text-center">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No output yet. Run your code to see results!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {userOutput.map((output, index) => {
                  const status = getOutputStatus(output);
                  return (
                    <div key={index} className={`rounded-lg border transition-all duration-200 ${
                      status === 'error' 
                        ? isDarkmode 
                          ? "bg-red-900/10 border-red-800/50" 
                          : "bg-red-50 border-red-200"
                        : status === 'warning'
                        ? isDarkmode
                          ? "bg-yellow-900/10 border-yellow-800/50"
                          : "bg-yellow-50 border-yellow-200"
                        : isDarkmode
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}>
                      <div className="flex items-center justify-between p-3 border-b border-gray-200/20">
                        <div className="flex items-center space-x-2">
                          {getOutputIcon(output)}
                          <span className="text-sm font-medium">Test Case {index + 1}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          status === 'error'
                            ? "bg-red-500 text-white"
                            : status === 'warning'
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                        }`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                      <div className="p-3">
                        <pre className={`whitespace-pre-wrap text-sm font-mono leading-relaxed ${
                          isDarkmode ? "text-gray-200" : "text-gray-800"
                        }`}>
                          {output}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;