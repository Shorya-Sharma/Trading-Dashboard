#!/bin/bash

# Trading Dashboard Startup Script
# This script sets up and starts both backend and frontend components

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Python version
check_python() {
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
        print_status "Python3 found: $PYTHON_VERSION"
        return 0
    elif command_exists python; then
        PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
        print_status "Python found: $PYTHON_VERSION"
        return 0
    else
        print_error "Python is not installed. Please install Python 3.7+"
        exit 1
    fi
}

# Function to check Node.js version
check_node() {
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
        return 0
    else
        print_error "Node.js is not installed. Please install Node.js 14+"
        exit 1
    fi
}

# Function to check npm
check_npm() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_status "npm found: $NPM_VERSION"
        return 0
    else
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    print_status "Upgrading pip..."
    pip install --upgrade pip
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    print_success "Backend setup completed!"
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd trading-dashboard-frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing npm dependencies..."
        npm install
    else
        print_status "node_modules found, checking for updates..."
        npm install
    fi
    
    print_success "Frontend setup completed!"
    cd ..
}

# Function to start backend server
start_backend() {
    print_status "Starting backend server..."
    
    cd backend
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Start the server in background
    print_status "Backend server will be available at: http://localhost:8000"
    print_status "API docs will be at: http://localhost:8000/docs"
    
    # Start server in background
    python run_server.py &
    BACKEND_PID=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if server started successfully
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend server started successfully (PID: $BACKEND_PID)"
    else
        print_error "Failed to start backend server"
        exit 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend..."
    
    cd trading-dashboard-frontend
    
    print_status "Frontend will be available at: http://localhost:3000"
    
    # Start frontend in background
    npm start &
    FRONTEND_PID=$!
    
    # Wait a moment for server to start
    sleep 5
    
    # Check if server started successfully
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend started successfully (PID: $FRONTEND_PID)"
    else
        print_error "Failed to start frontend"
        exit 1
    fi
    
    cd ..
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down servers..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend server stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend stopped"
    fi
    
    print_success "All servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo "=========================================="
    echo "    Trading Dashboard Startup Script"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_python
    check_node
    check_npm
    
    # Setup components
    setup_backend
    setup_frontend
    
    # Start servers
    start_backend
    start_frontend
    
    echo ""
    echo "=========================================="
    print_success "Trading Dashboard is now running!"
    echo "=========================================="
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8000"
    echo "API Documentation: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    echo ""
    
    # Wait for user interrupt
    wait
}

# Run main function
main
