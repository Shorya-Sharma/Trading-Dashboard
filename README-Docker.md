# Trading Dashboard - Docker Setup

This document provides instructions for running the Trading Dashboard application using Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd Trading-Dashboard
   ```

2. **Build and start the services**:

   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Services

### Backend (FastAPI)

- **Port**: 8000
- **Container**: `trading-dashboard-backend`
- **Health Check**: http://localhost:8000/health

### Frontend (React)

- **Port**: 3000
- **Container**: `trading-dashboard-frontend`
- **Health Check**: http://localhost:3000

## Docker Commands

### Start services

```bash
docker-compose up
```

### Start services in background

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

### Rebuild services

```bash
docker-compose up --build
```

### Remove everything (including volumes)

```bash
docker-compose down -v
```

## Development

### Running in development mode

For development, you might want to run the services with hot-reload:

1. **Backend development**:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python run_server.py
   ```

2. **Frontend development**:
   ```bash
   cd trading-dashboard-frontend
   npm install
   npm start
   ```

### Environment Variables

The backend service uses the following environment variables:

- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins (default: http://localhost:3000)
- `ORDERS_DIR`: Directory for storing orders (default: orders)
- `SYMBOLS_FILE`: Path to symbols configuration file (default: symbols.json)

You can override these in the `docker-compose.yml` file or by creating a `.env` file.

## Troubleshooting

### Port conflicts

If ports 3000 or 8000 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - '3001:80' # Change 3000 to 3001
```

### Build issues

If you encounter build issues:

1. Clean Docker cache:

   ```bash
   docker system prune -a
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

### Permission issues

On Linux/macOS, you might need to adjust file permissions:

```bash
chmod +x backend/run_server.py
```

## Production Deployment

For production deployment, consider:

1. **Using a reverse proxy** (nginx, traefik) in front of the services
2. **Setting up SSL/TLS certificates**
3. **Using environment-specific configurations**
4. **Implementing proper logging and monitoring**
5. **Setting up database persistence**

### Example production docker-compose.yml

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

  # ... other services
```

## Data Persistence

The application uses Docker volumes for data persistence:

- `orders_data`: Stores order data from the backend
- `symbols.json`: Mounted as read-only from the host

To backup data:

```bash
docker run --rm -v trading-dashboard_orders_data:/data -v $(pwd):/backup alpine tar czf /backup/orders_backup.tar.gz -C /data .
```

## Monitoring

Check service health:

```bash
docker-compose ps
```

View resource usage:

```bash
docker stats
```

## Cleanup

To completely remove the application and all data:

```bash
docker-compose down -v --rmi all
```
