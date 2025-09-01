# 📊 Trading Dashboard

A full-stack **Trading Dashboard** built with **React (frontend)** and **FastAPI (backend)**.
It supports **live market ticks via WebSocket**, symbol management, order creation, and order book display with sorting and filtering.

---

## 🚀 Features

### **Frontend (React + Material UI)**

- Dark, modern trading dashboard UI.
- **Symbols Panel** → View and manage tradeable symbols.
- **Order Panel** → Place new BUY/SELL orders with validations.
- **Live Price Ticker** → Real-time tick updates via WebSocket with sparkline chart.
- **Orders Table** → Sorting, filtering, manual refresh, and live auto-refresh.
- Built with **React 18, Redux Toolkit, Material UI 5, TanStack Table, Recharts**.

### **Backend (FastAPI + Python)**

- REST APIs for symbols and orders.
- WebSocket API for live ticks (`/ws/ticks`).
- Symbol and order persistence via JSON files.
- Tick simulation service (±5% random price variation).
- Configurable via environment variables.

---

## 🌍 Live Demo

You can access a live version of the trading dashboard.

⚠️ **Important:** The backend service may take a minute to spin up from a cold start.  
Please **click on the backend URL first**, wait for approximately **one minute**, and then access the frontend URL.

- **Backend:** [https://trading-dashboard-w71t.onrender.com/](https://trading-dashboard-w71t.onrender.com/)  
- **Frontend:** [https://trading-dashboard-iota-one.vercel.app/](https://trading-dashboard-iota-one.vercel.app/)


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

### 2. Quick Start (Recommended)

Use the automated startup script to set up and run both backend and frontend:

```bash
./start_trading_dashboard.sh
```

This script will:

- Check for required dependencies (Python 3.7+, Node.js, npm)
- Set up Python virtual environment and install backend dependencies
- Install frontend npm dependencies
- Start both backend and frontend servers
- Provide URLs for accessing the application

**URLs after startup:**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/api](http://localhost:8000/api)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- WebSocket: [ws://localhost:8000/ws/ticks](ws://localhost:8000/ws/ticks)

**To stop all servers:** Press `Ctrl+C`

---

### 3. Manual Setup (Alternative)

#### Backend Setup (FastAPI)

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

- REST APIs → [http://localhost:8000/api](http://localhost:8000/api)
- WebSocket → [ws://localhost:8000/ws/ticks](ws://localhost:8000/ws/ticks)
- Docs → [http://localhost:8000/docs](http://localhost:8000/docs)

#### Frontend Setup (React)

```bash
cd trading-dashboard-frontend
npm install
npm start
```

Frontend runs at:
👉 [http://localhost:3000](http://localhost:3000)

---

### 4. Running Backend Tests

To run the backend test suite with coverage reporting:

```bash
cd backend
python run_tests.py
```

This will:

- Install test dependencies (`pytest`, `pytest-cov`, `pytest-mock`, `pytest-asyncio`)
- Run all tests with verbose output
- Generate coverage reports (terminal and HTML)
- Show missing lines in coverage

**Test Coverage Report:**

- Terminal output shows coverage summary
- HTML report generated in `backend/htmlcov/` directory
- Open `backend/htmlcov/index.html` in browser for detailed coverage

**Individual Test Files:**

```bash
# Run specific test file
pytest tests/test_order_service.py -v

# Run with coverage for specific module
pytest tests/ --cov=app.services.order_service -v
```

---

### 5. Docker Compose Setup

For containerized deployment using Docker:

#### Prerequisites

- Docker and Docker Compose installed on your system

#### Quick Start with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Docker Services

**Backend Container:**

- FastAPI application running on port 8000
- Health checks every 30 seconds
- Persistent volume for orders data
- Environment variables for CORS and file paths

**Frontend Container:**

- React application served by Nginx on port 3000
- Multi-stage build for optimized production image
- Health checks every 30 seconds
- Configured to communicate with backend

#### Docker URLs

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/api](http://localhost:8000/api)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- WebSocket: [ws://localhost:8000/ws/ticks](ws://localhost:8000/ws/ticks)

#### Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Stop services
docker-compose down

# Remove volumes (clears data)
docker-compose down -v

# Rebuild and start
docker-compose up --build

# Scale services (if needed)
docker-compose up --scale backend=2
```

#### Docker Environment Variables

**Backend Environment:**

- `CORS_ALLOWED_ORIGINS`: Allowed origins for CORS
- `ORDERS_DIR`: Directory for order data storage
- `SYMBOLS_FILE`: Path to symbols configuration file

**Frontend Environment:**

- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_WS_BASE_URL`: WebSocket URL for live ticks

#### Docker Volumes

- `orders_data`: Persistent storage for order data
- `./backend/symbols.json`: Read-only mount of symbols configuration

#### Docker Networks

- `trading-network`: Internal network for service communication

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
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "market": "NASDAQ",
    "close_price": 150
  },
  {
    "symbol": "NVDA",
    "name": "NVIDIA Corp.",
    "market": "NASDAQ",
    "close_price": 700
  }
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

- **DashboardPage** → Landing dashboard with panels for Symbols, Orders, Order Book, and Live Ticker.
- **SymbolsPage** → Manage trading symbols.
- **CreateOrderPage** → Place BUY/SELL orders with validation.
- **OrdersTablePage** → Detailed order book with sorting/filtering/auto-refresh.
- **LivePriceTicker** → Real-time ticker with sparkline chart.

---

## 🔧 Tech Stack

- **Frontend**: React 18, Redux Toolkit, Material UI 5, TanStack Table, Recharts, Axios
- **Backend**: FastAPI, Python 3.10+, Uvicorn
- **Communication**: REST + WebSocket

---

## 📝 License

MIT License © 2025 **Shorya Sharma**

---
