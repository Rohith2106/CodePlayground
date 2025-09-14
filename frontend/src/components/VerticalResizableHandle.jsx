import React from "react";
import { GripHorizontal } from "lucide-react";

const VerticalResizableHandle = ({ onDragStart, isDarkmode }) => (
  <div
    className={`flex items-center justify-center cursor-row-resize hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
      isDarkmode ? "bg-gray-800" : "bg-gray-100"
    }`}
    onMouseDown={onDragStart}
    style={{ height: "8px" }}
  >
    <GripHorizontal className={`w-4 h-4 ${isDarkmode ? "text-gray-400" : "text-gray-500"}`} />
  </div>
);

export default VerticalResizableHandle;
