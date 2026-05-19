#!/bin/bash

# Smart Kindergarten Management System - Start Script
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

start() {
    echo "🏫 Smart Kindergarten tizimini ishga tushirish..."

    # Install backend dependencies
    echo "📦 Backend kutubxonalarini o'rnatish..."
    cd "$PROJECT_DIR/backend"
    pip install -r requirements.txt -q 2>/dev/null

    # Start backend
    echo "🚀 Backend serverini ishga tushirish (port 8080)..."
    cd "$PROJECT_DIR/backend"
    tmux new-session -d -s kindergarten-backend "cd $PROJECT_DIR/backend && python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload"

    # Start frontend
    echo "🎨 Frontend serverini ishga tushirish (port 3000)..."
    cd "$PROJECT_DIR/frontend"
    tmux new-session -d -s kindergarten-frontend "cd $PROJECT_DIR/frontend && PORT=3000 npm start"

    echo ""
    echo "✅ Tizim ishga tushdi!"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8080"
    echo "   API docs: http://localhost:8080/docs"
    echo ""
    echo "   Login: 993190712"
    echo "   Parol: 12345678"
}

stop() {
    echo "⏹️  Tizimni to'xtatish..."
    tmux kill-session -t kindergarten-backend 2>/dev/null
    tmux kill-session -t kindergarten-frontend 2>/dev/null
    echo "✅ To'xtatildi"
}

status() {
    echo "📊 Tizim holati:"
    if tmux has-session -t kindergarten-backend 2>/dev/null; then
        echo "   Backend:  ✅ ishlayapti"
    else
        echo "   Backend:  ❌ to'xtagan"
    fi
    if tmux has-session -t kindergarten-frontend 2>/dev/null; then
        echo "   Frontend: ✅ ishlayapti"
    else
        echo "   Frontend: ❌ to'xtagan"
    fi
}

case "$1" in
    start)   start ;;
    stop)    stop ;;
    restart) stop; sleep 2; start ;;
    status)  status ;;
    *)       echo "Foydalanish: $0 {start|stop|restart|status}"; exit 1 ;;
esac
