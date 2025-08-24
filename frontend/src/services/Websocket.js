class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
  }

  connect(url = "ws://localhost:4000/ws/ticks") {
    if (this.ws) return; // already connected

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("[WS] Connected");
    };

    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // fan out to all listeners
      this.listeners.forEach((cb) => cb(data));
    };

    this.ws.onclose = () => {
      console.log("[WS] Disconnected");
      this.ws = null;
      this.listeners.clear();
    };
  }

  sendWhenOpen(msg) {
    if (!this.ws) return;

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    } else if (this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.addEventListener(
        "open",
        () => {
          console.log("[WS] Sending after connect:", msg);
          this.ws?.send(msg);
        },
        { once: true }
      );
    } else {
      console.warn("[WS] Cannot send, state:", this.ws.readyState);
    }
  }

  subscribe(symbol) {
    console.log("[WS] Subscribing:", symbol);
    this.sendWhenOpen(JSON.stringify({ action: "subscribe", symbol }));
  }

  unsubscribe(symbol) {
    console.log("[WS] Unsubscribing:", symbol);
    this.sendWhenOpen(JSON.stringify({ action: "unsubscribe", symbol }));
  }

  addListener(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

const instance = new WebSocketService();
export default instance;
