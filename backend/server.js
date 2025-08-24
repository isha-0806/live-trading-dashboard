import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import { wss, symbols } from "./websocket.js";

const __dirname = path.resolve();

export function createApp(customOrdersDir) {
  const app = express();
  const ordersDir = customOrdersDir || path.join(__dirname, "orders");
  if (!fs.existsSync(ordersDir)) fs.mkdirSync(ordersDir);

  app.use(cors());
  app.use(bodyParser.json());

  app.get("/api/symbols", (req, res) => res.json(symbols));

  app.get("/api/orders", (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Missing symbol" });

    const filePath = path.join(ordersDir, `${symbol}.json`);
    if (!fs.existsSync(filePath)) return res.json([]);
    res.json(JSON.parse(fs.readFileSync(filePath, "utf8")));
  });

  app.post("/api/orders", (req, res) => {
    const { symbol, side, qty, price } = req.body;

    const sym = symbols.find((s) => s.symbol === symbol);
    if (!sym) return res.status(400).json({ error: "Invalid symbol" });
    if (qty <= 0)
      return res.status(400).json({ error: "Quantity must be > 0" });
    if (price <= 0) return res.status(400).json({ error: "Price must be > 0" });

    const min = sym.closePrice * 0.8;
    const max = sym.closePrice * 1.2;
    if (price < min || price > max) {
      return res.status(400).json({
        error: `Price must be within ±20% of ${
          sym.symbol
        } closePrice (allowed: ${min.toFixed(2)} to ${max.toFixed(2)})`,
      });
    }

    const filePath = path.join(ordersDir, `${symbol}.json`);
    let orders = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

    const newOrder = {
      id: orders.length ? orders[orders.length - 1].id + 1 : 1,
      symbol,
      side,
      qty,
      price,
      timestamp: Math.floor(Date.now() / 1000),
    };

    orders.push(newOrder);
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    res.json(newOrder);
  });

  return app;
}

const app = createApp();

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws/ticks") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  }
});

export { app };
