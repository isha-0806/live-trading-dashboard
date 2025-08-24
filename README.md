# Trading Dashboard

A real-time trading dashboard application with live price tickers, order management, and WebSocket-based data streaming.

## 🚀 Features

### Live Trading Dashboard

- **Real-time Price Tickers**: Live price updates for multiple stock symbols
- **Symbol Selection**: Switch between different trading symbols (AAPL, MSFT, GOOG, TSLA, etc.)
- **Price Movement Indicators**: Visual indicators showing price increases (green) and decreases (red)
- **Volume Tracking**: Real-time volume data for each symbol

### Order Management

- **Place Orders**: Submit buy/sell orders with quantity and price
- **Order History**: View all orders for selected symbols
- **Order Validation**: Price validation within ±20% of current market price
- **Order Tracking**: Unique order IDs and timestamps

### Technical Features

- **WebSocket Integration**: Real-time data streaming for live updates
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **RESTful API**: Backend API for order management and data retrieval
- **File-based Storage**: Orders stored as JSON files for simplicity

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trading-dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:4000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend application will start on `http://localhost:5173`

## 📊 Available Trading Symbols

The application supports the following symbols:

| Symbol  | Name                 | Market   | Base Price |
| ------- | -------------------- | -------- | ---------- |
| AAPL    | Apple Inc.           | NASDAQ   | $180.12    |
| MSFT    | Microsoft Corp.      | NASDAQ   | $323.45    |
| GOOG    | Alphabet Inc.        | NASDAQ   | $141.23    |
| TSLA    | Tesla Inc.           | NASDAQ   | $243.22    |
| V       | Visa Inc.            | NYSE     | $245.33    |
| AMZN    | Amazon.com Inc.      | NASDAQ   | $132.55    |
| META    | Meta Platforms Inc.  | NASDAQ   | $289.76    |
| NFLX    | Netflix Inc.         | NASDAQ   | $433.99    |
| NVDA    | NVIDIA Corp.         | NASDAQ   | $789.00    |
| JPM     | JPMorgan Chase & Co. | NYSE     | $158.73    |
| BTC-USD | Bitcoin / USD        | Crypto   | $29,000.00 |
| ETH-USD | Ethereum / USD       | Crypto   | $1,850.45  |
| SPY     | S&P 500 ETF          | NYSEARCA | $456.12    |
| QQQ     | NASDAQ 100 ETF       | NASDAQ   | $385.21    |

## 🔧 API Endpoints

### Backend API (Port 4000)

#### Get Available Symbols

```
GET /api/symbols
```

Returns list of all available trading symbols.

#### Get Orders for Symbol

```
GET /api/orders?symbol=AAPL
```

Returns all orders for the specified symbol.

#### Place New Order

```
POST /api/orders
Content-Type: application/json

{
  "symbol": "AAPL",
  "side": "buy",
  "qty": 10,
  "price": 180.50
}
```

### WebSocket Endpoints

#### Live Price Ticker

```
WebSocket: ws://localhost:4000/ws/ticks
```

**Subscribe to Symbol:**

```json
{
  "action": "subscribe",
  "symbol": "AAPL"
}
```

**Unsubscribe from Symbol:**

```json
{
  "action": "unsubscribe",
  "symbol": "AAPL"
}
```

**Received Tick Data:**

```json
{
  "symbol": "AAPL",
  "price": 181.25,
  "volume": 45,
  "timestamp": 1703123456
}
```

## 🎯 Usage Guide

### 1. Viewing Live Tickers

1. Open the application in your browser
2. The dashboard will show the current symbol's live price
3. Use the symbol selector to switch between different symbols
4. Watch for color changes indicating price movements:
   - **Green**: Price increased
   - **Red**: Price decreased
   - **Gray**: Initial load

### 2. Placing Orders

1. Select a symbol from the dropdown
2. Fill in the order form:
   - **Side**: Choose "Buy" or "Sell"
   - **Quantity**: Enter the number of shares
   - **Price**: Enter your desired price
3. Click "Place Order"
4. The order will be validated and stored

### 3. Viewing Order History

1. Select a symbol to view its order history
2. Orders are displayed in a table format
3. Each order shows:
   - Order ID
   - Symbol
   - Side (Buy/Sell)
   - Quantity
   - Price
   - Timestamp

## 🔒 Order Validation Rules

- **Quantity**: Must be greater than 0
- **Price**: Must be greater than 0
- **Price Range**: Must be within ±20% of the symbol's base price
- **Symbol**: Must be a valid trading symbol

## 📁 Project Structure

```
trading-dashboard/
├── backend/
│   ├── orders/           # Order storage (JSON files)
│   ├── server.js         # Express server
│   ├── websocket.js      # WebSocket implementation
│   ├── symbols.json      # Available symbols data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API and WebSocket services
│   │   ├── context/      # React context
│   │   └── main.jsx      # App entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🛠️ Development

### Backend Development

- **Framework**: Express.js
- **WebSocket**: ws library
- **Storage**: File-based JSON storage
- **Port**: 4000

### Frontend Development

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Port**: 5173

### Key Components

- **LiveTicker**: Real-time price display
- **OrderForm**: Order placement interface
- **OrdersTable**: Order history display
- **SymbolSelect**: Symbol selection dropdown
- **TradingDashboard**: Main dashboard layout

## 🔧 Configuration

### Environment Variables

Currently, the application uses default configurations. You can modify:

- **Backend Port**: Change `PORT` in `backend/server.js`
- **Frontend Port**: Change in `frontend/vite.config.js`
- **WebSocket URL**: Update in `frontend/src/services/Websocket.js`

### Adding New Symbols

To add new trading symbols:

1. Edit `backend/symbols.json`
2. Add new symbol object:

```json
{
  "symbol": "NEW",
  "name": "New Company Inc.",
  "market": "NASDAQ",
  "closePrice": 100.0
}
```
