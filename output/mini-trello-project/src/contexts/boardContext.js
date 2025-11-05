import { createContext, useContext } from "react";

export const BoardContext = createContext(null);

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used inside BoardContext.Provider");
  return ctx;
};