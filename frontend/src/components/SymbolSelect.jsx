// modules
import { useContext } from "react";
// context
import { SymbolContext } from "../context/SymbolContext";
// components
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const SymbolSelect = () => {
  const { symbols, symbol, setSymbol } = useContext(SymbolContext);
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Symbol</InputLabel>
      <Select
        value={symbol}
        label="Symbol"
        onChange={(e) => setSymbol(e.target.value)}
        className="h-30"
      >
        {symbols.map((s) => (
          <MenuItem key={s.symbol} value={s.symbol}>
            {s.symbol} – {s.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
