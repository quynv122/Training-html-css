import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [boardData, setBoardData] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(boardData));
    } catch (error) {
      console.error(error);
    }
  }, [key, boardData]);

  return [boardData, setBoardData];
};