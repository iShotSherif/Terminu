import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import 'gridstack/dist/gridstack.min.css'; // Ensure Gridstack's styles are loaded
import { GridStack } from 'gridstack';

const GridContext = createContext(null);

export const useGrid = () => useContext(GridContext);

export const GridProvider = ({ children }) => {
  const gridRef = useRef(null);
  const [gridInstance, setGridInstance] = useState(null);

  useEffect(() => {
    // Ensure the '.grid-stack' element is present in the DOM before initializing.
    const grid = GridStack.init({
      cellHeight: '7px', // Adjusted for demonstration, set this according to your needs
      width: 12, // Adjusted for demonstration, set this according to your layout needs
      float: true,
      removable: true,
      removeTimeout: 100,
      acceptWidgets: true,
      draggable: {
        handle: '.chart-header', // Specify drag handle
      },
      resizable: {
        handles: 'e, se', // Adjust based on which edges you want to be resizable
      },
    });

    gridRef.current = grid;
    setGridInstance(grid); // Trigger re-render

    return () => grid?.destroy();
  }, []);

  // Pass the grid instance through context
  return <GridContext.Provider value={gridInstance}>{children}</GridContext.Provider>;
};
