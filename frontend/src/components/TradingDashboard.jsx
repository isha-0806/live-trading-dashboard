// modules
import { useContext, useEffect } from "react";
// context
import { SymbolContext } from "../context/SymbolContext";
// components
import LiveTicker from "./LiveTicker";
import OrderForm from "./OrderForm";
import OrdersTable from "./OrdersTable";

export const TradingDashboard = () => {
  const { setSymbols } = useContext(SymbolContext);

  useEffect(() => {
    fetch("http://localhost:4000/api/symbols")
      .then((res) => res.json())
      .then(setSymbols)
      .catch(() => setSymbols([{ symbol: "AAPL", name: "Apple Inc." }]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex justify-center items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          📊 Trading Dashboard
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <LiveTicker />
          <OrderForm />
        </div>
        <OrdersTable />
      </div>
    </div>
  );
};
