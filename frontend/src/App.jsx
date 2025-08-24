import { TradingDashboard } from "./components/TradingDashboard";
import { SymbolProvider } from "./context/SymbolContext";

export default function App() {
  return (
    <SymbolProvider>
      <TradingDashboard />
    </SymbolProvider>
  );
}
