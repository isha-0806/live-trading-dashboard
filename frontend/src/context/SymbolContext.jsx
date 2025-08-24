// modules
import { createContext, useState } from "react";

export const SymbolContext = createContext();

export const SymbolProvider = ({ children }) => {
  const [symbol, setSymbol] = useState("AAPL");
  const [symbols, setSymbols] = useState([]);

  return (
    <SymbolContext.Provider value={{ symbol, setSymbol, symbols, setSymbols }}>
      {children}
    </SymbolContext.Provider>
  );
};
