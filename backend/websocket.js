import { WebSocketServer } from "ws";
import fs from "fs";

const symbols = JSON.parse(fs.readFileSync("./symbols.json", "utf8"));

const wss = new WebSocketServer({ noServer: true });

function getRandomPrice(closePrice) {
  const range = closePrice * 0.05;
  return +(closePrice + (Math.random() * 2 - 1) * range).toFixed(2);
}

wss.on("connection", (ws) => {
  ws.currentSubscription = { symbol: null, interval: null };
  console.log(`[WS] Connected to WS`);

  ws.on("message", (msg) => {
    try {
      const { action, symbol } = JSON.parse(msg.toString());

      if (!symbol) {
        console.warn("[WS] No symbol provided");
        return;
      }

      const sym = symbols.find((s) => s.symbol === symbol);
      if (!sym) {
        console.warn(`[WS] Invalid symbol: ${symbol}`);
        return;
      }

      if (action === "subscribe") {
        if (ws.currentSubscription.interval) {
          clearInterval(ws.currentSubscription.interval);
          ws.currentSubscription = { symbol: null, interval: null };
        }

        const interval = setInterval(() => {
          if (
            ws.readyState === ws.OPEN &&
            ws.currentSubscription.symbol === symbol
          ) {
            const tickData = {
              symbol,
              price: getRandomPrice(sym.closePrice),
              volume: Math.floor(Math.random() * 100) + 1,
              timestamp: Math.floor(Date.now() / 1000),
            };
            ws.send(JSON.stringify(tickData));
          } else if (ws.currentSubscription.symbol !== symbol) {
            clearInterval(interval);
          }
        }, 2000);

        ws.currentSubscription = { symbol, interval };
        console.log(
          `[WS] Subscribed to ${symbol}. Current subscription:`,
          ws.currentSubscription
        );
      }

      if (action === "unsubscribe") {
        if (
          ws.currentSubscription.symbol === symbol &&
          ws.currentSubscription.interval
        ) {
          console.log(`[WS] Unsubscribing from ${symbol}`);
          clearInterval(ws.currentSubscription.interval);
          ws.currentSubscription = { symbol: null, interval: null };
          console.log(`[WS] Successfully unsubscribed from ${symbol}`);
        }
      }
    } catch (err) {
      console.error("WebSocket error:", err.message);
    }
  });

  ws.on("close", () => {
    if (ws.currentSubscription.interval) {
      clearInterval(ws.currentSubscription.interval);
    }
    ws.currentSubscription = { symbol: null, interval: null };
    console.log(`[WS] Client disconnected.`);
  });
});

export { wss, symbols };
