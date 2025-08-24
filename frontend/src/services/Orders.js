class OrdersService {
  placeOrder({ symbol, side, qty, price }) {
    return fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol,
        side,
        qty: Number(qty),
        price: Number(price),
      }),
    });
  }

  async fetchOrders(symbol) {
    const res = await fetch(
      `http://localhost:4000/api/orders?symbol=${symbol}`,
      {
        cache: "no-store",
      }
    );
    const orders = await res.json();
    return orders;
  }
}

export default new OrdersService();
