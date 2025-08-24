// modules
import { useEffect, useState, useContext } from "react";
// components
import { SymbolSelect } from "./SymbolSelect";
// context
import { SymbolContext } from "../context/SymbolContext";
// services
import WebSocketService from "../services/Websocket";

export default function LiveTicker() {
  const { symbol, symbols } = useContext(SymbolContext);
  const [tick, setTick] = useState(null);
  const [, setLastPrice] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const symbolData = symbols.find((s) => s.symbol === symbol);
    if (symbolData) {
      setTick({
        symbol: symbolData.symbol,
        price: symbolData.closePrice,
        volume: 0,
        timestamp: Math.floor(Date.now() / 1000),
        isUp: null,
      });
      setLastPrice(symbolData.closePrice);
    }

    WebSocketService.connect();
    WebSocketService.subscribe(symbol);

    const removeListener = WebSocketService.addListener((data) => {
      if (data.symbol === symbol) {
        setLastPrice((prev) => {
          setTick({
            ...data,
            isUp: prev !== null ? data.price > prev : null,
          });
          return data.price;
        });
      }
    });

    return () => {
      WebSocketService.unsubscribe(symbol);
      removeListener();
    };
  }, [symbol]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-3 transition">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">
          Live Ticker ({symbol?.symbol || "—"})
        </h2>
        <SymbolSelect />
      </div>

      {tick ? (
        <div className="flex items-center gap-4">
          <span
            className={`text-2xl font-bold transition-colors duration-300 ${
              tick.isUp === null
                ? "text-gray-800"
                : tick.isUp
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            💰 {tick.price}
          </span>
          <span className="text-sm text-gray-500">
            Vol <strong>{tick.volume}</strong>
          </span>
        </div>
      ) : (
        <p className="text-gray-500">Waiting for ticks...</p>
      )}

      {tick && (
        <p className="text-xs text-gray-400">
          Updated at {new Date(tick.timestamp * 1000).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
