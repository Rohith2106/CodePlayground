// src/api/codeExecution.js
import axios from "axios";

export const executeCode = async (language, code, inputs) => {
  try {
    console.log("Sending request to:", import.meta.env.VITE_API_URL);
    console.log("Request data:", { language, code: code.substring(0, 100) + "...", inputs, key: "***" });
    
    const response = await axios.post(import.meta.env.VITE_API_URL, {
      language: language,
      code: code,
      inputs: inputs,
      key: import.meta.env.VITE_API_KEY,
    });

    console.log("Response received:", response.status, response.data);

    if (response.data.status === "error") {
      // Return a structured error response
      return { error: true, outputs: [response.data.message] };
    }
    return { error: false, outputs: response.data.outputs };
  } catch (err) {
    console.error("API Error:", err);
    console.error("Error details:", err.response?.data);
    
    if (err.response?.data?.message) {
      return { error: true, outputs: [err.response.data.message] };
    } else if (err.response?.status === 500) {
      return { error: true, outputs: ["Server error: Please check the server logs for details."] };
    } else if (err.code === 'NETWORK_ERROR' || !err.response) {
      return { error: true, outputs: ["Error: Could not connect to the execution service."] };
    } else {
      return { error: true, outputs: [`Error: ${err.message}`] };
    }
  }
};