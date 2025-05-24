import { useState } from "react";

// Undo-Redo Hook
export const useUndoRedo = (initialState) => {
    const [history, setHistory] = useState([initialState]);
    const [index, setIndex] = useState(0);
  
    const setNewState = (newState) => {
      const newHistory = history.slice(0, index + 1);
      setHistory([...newHistory, newState]);
      setIndex(newHistory.length);
    };
  
    const undo = () => {
      if (index > 0) setIndex(index - 1);
    };
  
    const redo = () => {
      if (index < history.length - 1) setIndex(index + 1);
    };
  
    return [history[index], setNewState, undo, redo];
  };