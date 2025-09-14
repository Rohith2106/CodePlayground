import { useState, useCallback } from "react";

export const useVerticalResizable = (initialHeight = "40%") => {
  const [outputHeight, setOutputHeight] = useState(initialHeight);

  const startVerticalDrag = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = outputHeight;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const windowHeight = window.innerHeight;
      // Invert the deltaY to make dragging up increase height
      const newHeightPercent = ((parseFloat(startHeight) * windowHeight / 100) - deltaY) / windowHeight * 100;
      
      // Constrain between 20% and 80%
      const constrainedHeight = Math.max(20, Math.min(80, newHeightPercent));
      setOutputHeight(`${constrainedHeight}%`);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [outputHeight]);

  return { outputHeight, startVerticalDrag };
};
