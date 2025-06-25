#!/bin/bash

# RealWorld Django + Angular Development Server Script
# Enhanced script with initialization, start/stop/restart functionality

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Function to check if sessions are running
check_sessions() {
    backend_running=$(tmux list-sessions 2>/dev/null | grep "realworld-backend" | wc -l || echo "0")
    frontend_running=$(tmux list-sessions 2>/dev/null | grep "realworld-frontend" | wc -l || echo "0")
}

# Function to stop sessions
stop_sessions() {
    print_info "Stopping RealWorld sessions..."
    tmux kill-session -t realworld-backend 2>/dev/null || true
    tmux kill-session -t realworld-frontend 2>/dev/null || true
    print_status "Sessions stopped"
}

# Function to check and setup environment
setup_environment() {
    print_info "Checking environment setup..."

    # Check if virtual environment exists
    if [ ! -d ".venv" ]; then
        print_warning "Python virtual environment not found. Creating..."
        python3 -m venv .venv
        print_status "Virtual environment created"
    fi

    # Check if backend dependencies are installed
    if [ ! -f ".venv/lib/python3.12/site-packages/django/__init__.py" ]; then
        print_warning "Backend dependencies not found. Installing..."
        source .venv/bin/activate && pip install -r backend/requirements.txt
        print_status "Backend dependencies installed"
    fi

    # Check if frontend dependencies are installed
    if [ ! -d "frontend/node_modules" ]; then
        print_warning "Frontend dependencies not found. Installing..."
        npm --prefix=frontend install
        print_status "Frontend dependencies installed"
    fi

    # Check if database exists and is migrated
    if [ ! -f "backend/db.sqlite3" ]; then
        print_warning "Database not found. Running migrations..."
        source .venv/bin/activate && python backend/manage.py migrate
        print_status "Database migrations applied"
        
        print_info "Seeding database with sample data..."
        source .venv/bin/activate && python seed_data.py
        print_status "Database seeded"
    fi

    # Check if frontend is built (for Django static serving)
    if [ ! -f "frontend/dist/frontend/browser/index.html" ]; then
        print_warning "Frontend not built. Building for Django static serving..."
        npm --prefix=frontend run build
        print_status "Frontend built"
    fi
}

# Function to start sessions
start_sessions() {
    check_sessions
    
    if [ "$backend_running" -gt 0 ] || [ "$frontend_running" -gt 0 ]; then
        print_warning "Some sessions are already running. Restarting..."
        stop_sessions
        sleep 2
    fi

    print_info "Starting RealWorld project in tmux sessions..."

    # Start Django backend in tmux session
    tmux new-session -d -s realworld-backend -c "$PROJECT_DIR" \
        'source .venv/bin/activate && python backend/manage.py runserver 0.0.0.0:8000'

    # Start Angular frontend in tmux session  
    tmux new-session -d -s realworld-frontend -c "$PROJECT_DIR" \
        'npm --prefix=frontend start'

    sleep 2  # Give sessions time to start
}

# Function to show status
show_status() {
    check_sessions
    echo
    print_info "RealWorld Project Status:"
    
    if [ "$backend_running" -gt 0 ]; then
        print_status "Backend: Running on port 8000"
    else
        print_error "Backend: Not running"
    fi
    
    if [ "$frontend_running" -gt 0 ]; then
        print_status "Frontend: Running on port 4200"
    else
        print_error "Frontend: Not running"
    fi
    
    echo
    if [ "$backend_running" -gt 0 ] || [ "$frontend_running" -gt 0 ]; then
        echo -e "${BLUE}Access the application:${NC}"
        if [ "$frontend_running" -gt 0 ]; then
            echo "  🌐 Frontend (dev): http://localhost:4200"
        fi
        if [ "$backend_running" -gt 0 ]; then
            echo "  🌐 Django + Angular: http://localhost:8000"
            echo "  🔌 Backend API: http://localhost:8000/api"
        fi
        echo
        echo -e "${BLUE}Login credentials:${NC}"
        echo "  📧 alice@realworld.io / password123"
        echo "  📧 bob@realworld.io / password123"
        echo "  📧 charlie@realworld.io / password123"
        echo
        echo -e "${BLUE}Useful commands:${NC}"
        echo "  ./start-dev.sh status    - Show this status"
        echo "  ./start-dev.sh stop      - Stop all services"
        echo "  ./start-dev.sh restart   - Restart all services"
        echo "  tmux list-sessions       - List all tmux sessions"
        echo "  tmux attach-session -t realworld-backend  - Attach to backend"
        echo "  tmux attach-session -t realworld-frontend - Attach to frontend"
    fi
}

# Function to show usage
show_usage() {
    echo "RealWorld Django + Angular Development Script"
    echo
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  start     - Initialize environment and start services (default)"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  status    - Show current status"
    echo "  init      - Initialize environment only (no start)"
    echo "  help      - Show this help message"
    echo
}

# Main script logic
case "${1:-start}" in
    "start")
        setup_environment
        start_sessions
        show_status
        ;;
    "stop")
        stop_sessions
        show_status
        ;;
    "restart")
        setup_environment
        stop_sessions
        sleep 2
        start_sessions
        show_status
        ;;
    "status")
        show_status
        ;;
    "init")
        setup_environment
        print_status "Environment initialized. Run './start-dev.sh start' to start services."
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_usage
        exit 1
        ;;
esac