import request from "supertest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the server app

import { createApp } from "../server.js";
let app;

describe("Trading Dashboard Backend API Tests", () => {
  let testOrdersDir;

  beforeAll(() => {
    // Create test orders directory
    testOrdersDir = path.join(__dirname, "test-orders");
    if (!fs.existsSync(testOrdersDir)) {
      fs.mkdirSync(testOrdersDir);
    }
    app = createApp(testOrdersDir);
  });

  afterAll(() => {
    // Clean up test orders directory
    if (fs.existsSync(testOrdersDir)) {
      fs.rmSync(testOrdersDir, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    // Clear test orders before each test
    if (fs.existsSync(testOrdersDir)) {
      fs.rmSync(testOrdersDir, { recursive: true, force: true });
      fs.mkdirSync(testOrdersDir);
    }
  });

  describe("POST /api/orders", () => {
    test("should create new order successfully", async () => {
      const orderData = {
        symbol: "AAPL",
        side: "buy",
        qty: 10,
        price: 180.5,
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("symbol", "AAPL");
      expect(response.body).toHaveProperty("side", "buy");
      expect(response.body).toHaveProperty("qty", 10);
      expect(response.body).toHaveProperty("price", 180.5);
      expect(response.body).toHaveProperty("timestamp");
    });

    test("should return 400 for invalid symbol", async () => {
      const orderData = {
        symbol: "INVALID",
        side: "buy",
        qty: 10,
        price: 180.5,
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid symbol");
    });

    test("should return 400 for invalid quantity", async () => {
      const orderData = {
        symbol: "AAPL",
        side: "buy",
        qty: 0,
        price: 180.5,
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Quantity must be > 0");
    });

    test("should return 400 for invalid price", async () => {
      const orderData = {
        symbol: "AAPL",
        side: "buy",
        qty: 10,
        price: 0,
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Price must be > 0");
    });

    test("should return 400 for price outside allowed range", async () => {
      const orderData = {
        symbol: "AAPL",
        side: "buy",
        qty: 10,
        price: 50,
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("Price must be within ±20%");
    });

    test("should increment order ID correctly", async () => {
      // Create first order
      const orderData1 = {
        symbol: "AAPL",
        side: "buy",
        qty: 10,
        price: 180.5,
      };

      const response1 = await request(app)
        .post("/api/orders")
        .send(orderData1)
        .expect(200);

      // Create second order
      const orderData2 = {
        symbol: "AAPL",
        side: "sell",
        qty: 5,
        price: 181.0,
      };

      const response2 = await request(app)
        .post("/api/orders")
        .send(orderData2)
        .expect(200);

      expect(response2.body.id).toBe(response1.body.id + 1);
    });

    test("should handle both buy and sell orders", async () => {
      const buyOrder = {
        symbol: "AAPL",
        side: "buy",
        qty: 10,
        price: 180.5,
      };

      const sellOrder = {
        symbol: "AAPL",
        side: "sell",
        qty: 5,
        price: 181.0,
      };

      await request(app).post("/api/orders").send(buyOrder).expect(200);

      await request(app).post("/api/orders").send(sellOrder).expect(200);

      const ordersResponse = await request(app)
        .get("/api/orders?symbol=AAPL")
        .expect(200);

      expect(ordersResponse.body).toHaveLength(2);
      expect(ordersResponse.body[0].side).toBe("buy");
      expect(ordersResponse.body[1].side).toBe("sell");
    });
  });

  // describe("Order validation edge cases", () => {
  //   test("should accept price at exact 20% above base price", async () => {
  //     const orderData = {
  //       symbol: "AAPL",
  //       side: "buy",
  //       qty: 10,
  //       price: 180.12 * 1.2, // Exactly 20% above base price
  //     };

  //     await request(app).post("/api/orders").send(orderData).expect(200);
  //   });

  //   test("should accept price at exact 20% below base price", async () => {
  //     const orderData = {
  //       symbol: "AAPL",
  //       side: "buy",
  //       qty: 10,
  //       price: 180.12 * 0.8, // Exactly 20% below base price
  //     };

  //     await request(app).post("/api/orders").send(orderData).expect(200);
  //   });

  //   test("should reject price slightly above 20% limit", async () => {
  //     const orderData = {
  //       symbol: "AAPL",
  //       side: "buy",
  //       qty: 10,
  //       price: 180.12 * 1.21, // Slightly above 20% limit
  //     };

  //     const response = await request(app)
  //       .post("/api/orders")
  //       .send(orderData)
  //       .expect(400);

  //     expect(response.body.error).toContain("Price must be within ±20%");
  //   });
  // });
});
