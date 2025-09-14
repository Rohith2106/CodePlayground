// App.jsx
import React, { useState, useEffect, useCallback } from "react";

import { useTheme } from "./hooks/useTheme";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useResizablePanels } from "./hooks/useResizablePanels";
import { useVerticalResizable } from "./hooks/useVerticalResizable";

import Header from "./components/Header";
import EditorPanel from "./components/EditorPanel";
import ResizableHandle from "./components/ResizableHandle";
import VerticalResizableHandle from "./components/VerticalResizableHandle";
import ControlsPanel from "./components/ControlsPanel";
import LoadingSpinner from "./components/LoadingSpinner";

import { executeCode } from "./api/codeExecution";
import { Terminal, CheckCircle, XCircle, AlertCircle } from "lucide-react";

import { languageOptions } from "./constants/languages";

export default function App() {

  const [isDarkmode, toggleTheme] = useTheme(true);

  const [userCode, setUserCode] = useLocalStorage("userCode", languageOptions[0].boilerplate);

  const { editorWidth, startDrag } = useResizablePanels("60%");
  const { outputHeight, startVerticalDrag } = useVerticalResizable("40%");
  
  const [userLang, setUserLang] = useLocalStorage("userLanguage", languageOptions[0]);
  
  const [userInput, setUserInput] = useState([""]);
  const [userOutput, setUserOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const runCode = useCallback(async () => {
    if (!userCode) return;
    setLoading(true);
    setUserOutput([]); // Clear previous output immediately
    const { outputs } = await executeCode(userLang.apiValue, userCode, userInput);
    setUserOutput(outputs);
    setLoading(false);
  }, [userCode, userLang.apiValue, userInput]);

  const loadCodeFromFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setUserCode(evt.target.result);
      reader.readAsText(file);
    }
  };
  const saveCodeToFile = () => {
    const filename = document.getElementById("filename").value || "code.txt";
    const userCode = localStorage.getItem("userCode");
    const codeToSave = userCode ? JSON.parse(userCode) : "";

    const blob = new Blob([codeToSave], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Required for Firefox
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode]); // Re-attach listener only if the runCode function changes


  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDarkmode ? "text-white bg-gray-900" : "text-black bg-gray-100"}`}>
      <Header isDarkmode={isDarkmode} toggleTheme={toggleTheme} />
      
      <main className="flex flex-grow overflow-hidden">
        <EditorPanel
          width={editorWidth}
          mode={userLang.mode}
          theme={isDarkmode ? "one_dark" : "github"}
          userCode={userCode}
          setUserCode={setUserCode}
        />
        
        <ResizableHandle onDragStart={startDrag} isDarkmode={isDarkmode} />

        <div className="flex flex-col overflow-hidden" style={{ width: `calc(100% - ${editorWidth})` }}>
            <div className={`p-4 flex flex-row space-x-4 items-center border-b flex-shrink-0 ${isDarkmode ? 'border-gray-700' : 'border-gray-200'}`}>
                <label htmlFor="uploadFile" className="font-medium whitespace-nowrap">Load File:</label>
                <input
                    type="file"
                    id="uploadFile"
                    className={`p-1 rounded border file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold ${isDarkmode ? "file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500" : "file:bg-gray-200 file:text-blue-700 hover:file:bg-blue-100"} ${isDarkmode ? 'border-gray-600' : 'border-gray-400'}`}
                    onChange={loadCodeFromFile}
                />
            </div>
            
            {/* File Save Controls */}
            <div className={`p-4 flex flex-row space-x-4 items-center border-b flex-shrink-0 ${isDarkmode ? 'border-gray-700' : 'border-gray-200'}`}>
                <label htmlFor="filename" className="font-medium whitespace-nowrap">Filename:</label>
                <input
                    type="text"
                    id="filename"
                    className={`p-2 rounded border flex-grow ${isDarkmode ? "bg-gray-800 text-white border-gray-600" : "bg-gray-200 text-black border-gray-400"}`}
                    placeholder="code.txt"
                />
                <button
                    onClick={saveCodeToFile}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Save
                </button>
            </div>
            
            {/* Controls Panel */}
            <div className="flex-1 overflow-hidden" style={{ height: `calc(100% - ${outputHeight})` }}>
                <ControlsPanel
                    width="100%"
                    isDarkmode={isDarkmode}
                    userLang={userLang}
                    setUserLang={setUserLang}
                    userInput={userInput}
                    setUserInput={setUserInput}
                    userOutput={userOutput}
                    loading={loading}
                    runCode={runCode}
                    setUserCode={setUserCode}
                />
            </div>
            
            {/* Vertical Resizable Handle */}
            <VerticalResizableHandle onDragStart={startVerticalDrag} isDarkmode={isDarkmode} />
            
            {/* Output Panel */}
            <div className="overflow-hidden" style={{ height: outputHeight }}>
                <div className={`h-full ${isDarkmode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
            </div>
        </div>
      </main>
    </div>
  );
}