# 📊 Trading Dashboard

A full-stack **Trading Dashboard** built with **React (frontend)** and **FastAPI (backend)**.
It supports **live market ticks via WebSocket**, symbol management, order creation, and order book display with sorting and filtering.

---

## 🚀 Features

### **Frontend (React + Material UI)**

* Dark, modern trading dashboard UI.
* **Symbols Panel** → View and manage tradeable symbols.
* **Order Panel** → Place new BUY/SELL orders with validations.
* **Live Price Ticker** → Real-time tick updates via WebSocket with sparkline chart.
* **Orders Table** → Sorting, filtering, manual refresh, and live auto-refresh.
* Built with **React 18, Redux Toolkit, Material UI 5, TanStack Table, Recharts**.

### **Backend (FastAPI + Python)**

* REST APIs for symbols and orders.
* WebSocket API for live ticks (`/ws/ticks`).
* Symbol and order persistence via JSON files.
* Tick simulation service (±5% random price variation).
* Configurable via environment variables.

---

## 🛠️ Project Structure

```
trading-dashboard/
├── backend/ # FastAPI backend
│   ├── app/
│   │   ├── api/ # API routes (symbols, orders, ticks)
│   │   ├── models/ # Data models
│   │   ├── services/ # Business logic
│   │   ├── core/ # Exception handling
│   │   ├── config.py # App settings
│   │   └── main.py # FastAPI entrypoint
│   └── requirements.txt # Python dependencies
│
└── trading-dashboard-frontend/ # React frontend
    ├── public/ # index.html, favicon
    ├── src/
    │   ├── api/ # Axios API clients
    │   ├── components/ # UI components
    │   ├── pages/ # Pages (Dashboard, Symbols, Orders, etc.)
    │   ├── store/ # Redux slices
    │   └── App.js # React entrypoint
    └── package.json # Node dependencies
```

---

## ⚡ Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/shorya-sharma/trading-dashboard.git
cd trading-dashboard
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
# (Linux/Mac)
source venv/bin/activate
# (Windows)
venv\Scripts\activate

pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at:

* REST APIs → [http://localhost:8000/api](http://localhost:8000/api)
* WebSocket → `ws://localhost:8000/ws/ticks`
* Docs → [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup (React)

```bash
cd trading-dashboard-frontend
npm install
npm start
```

Frontend runs at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Usage Examples

### 1. Health Check

```http
GET http://localhost:8000/health
```

Response:

```json
{ "status": "ok" }
```

---

### 2. Symbols API

**Get All Symbols**

```http
GET http://localhost:8000/api/symbols
```

Response:

```json
[
  { "symbol": "AAPL", "name": "Apple Inc.", "market": "NASDAQ", "close_price": 150 },
  { "symbol": "NVDA", "name": "NVIDIA Corp.", "market": "NASDAQ", "close_price": 700 }
]
```

**Add Symbol**

```http
POST http://localhost:8000/api/symbols
Content-Type: application/json

{
  "symbol": "TSLA",
  "name": "Tesla Inc.",
  "market": "NASDAQ",
  "close_price": 250
}
```

---

### 3. Orders API

**Create Order**

```http
POST http://localhost:8000/api/orders
Content-Type: application/json

{
  "symbol": "NVDA",
  "side": "BUY",
  "quantity": 10,
  "price": 700
}
```

Response:

```json
{
  "symbol": "NVDA",
  "side": "BUY",
  "quantity": 10,
  "price": 700,
  "id": 1756635203609,
  "timestamp": 1756635203
}
```

**Get Orders**

```http
GET http://localhost:8000/api/orders?symbol=NVDA
```

Response:

```json
[
  {
    "symbol": "NVDA",
    "side": "BUY",
    "quantity": 23,
    "price": 700,
    "id": 1756635203609,
    "timestamp": 1756635203
  }
]
```

---

### 4. Live Ticks (WebSocket)

**Connect to:**

```
ws://localhost:8000/ws/ticks
```

**Subscribe to a symbol:**

```json
{ "action": "subscribe", "symbol": "NVDA" }
```

**Incoming ticks:**

```json
{ "symbol": "NVDA", "price": 705.32, "volume": 324, "timestamp": 1700001234 }
{ "symbol": "NVDA", "price": 699.10, "volume": 187, "timestamp": 1700001236 }
```

---

## 🎨 Frontend Pages

* **DashboardPage** → Landing dashboard with panels for Symbols, Orders, Order Book, and Live Ticker.
* **SymbolsPage** → Manage trading symbols.
* **CreateOrderPage** → Place BUY/SELL orders with validation.
* **OrdersTablePage** → Detailed order book with sorting/filtering/auto-refresh.
* **LivePriceTicker** → Real-time ticker with sparkline chart.

---

## 🔧 Tech Stack

* **Frontend**: React 18, Redux Toolkit, Material UI 5, TanStack Table, Recharts, Axios
* **Backend**: FastAPI, Python 3.10+, Uvicorn
* **Communication**: REST + WebSocket

---

## 📝 License

MIT License © 2025 **Shorya Sharma**

---
