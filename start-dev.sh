#!/bin/bash

# RealWorld Django + Angular Development Server Script
# This script uses tmux to run both backend and frontend in background sessions

PROJECT_DIR="/home/codespace/projects/realworld-django-rest-framework-angular"
cd "$PROJECT_DIR"

# Kill any existing tmux sessions
tmux kill-session -t realworld-backend 2>/dev/null || true
tmux kill-session -t realworld-frontend 2>/dev/null || true

echo "Starting RealWorld project in tmux sessions..."

# Start Django backend in tmux session
tmux new-session -d -s realworld-backend -c "$PROJECT_DIR" \
    'source .venv/bin/activate && python backend/manage.py runserver 0.0.0.0:8000'

# Start Angular frontend in tmux session  
tmux new-session -d -s realworld-frontend -c "$PROJECT_DIR" \
    'npm --prefix=frontend start'

echo "✅ Backend started in tmux session 'realworld-backend' on port 8000"
echo "✅ Frontend started in tmux session 'realworld-frontend' on port 4200"
echo ""
echo "To view sessions:"
echo "  tmux list-sessions"
echo ""
echo "To attach to sessions:"
echo "  tmux attach-session -t realworld-backend"
echo "  tmux attach-session -t realworld-frontend"
echo ""
echo "To stop sessions:"
echo "  tmux kill-session -t realworld-backend"
echo "  tmux kill-session -t realworld-frontend"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:4200"
echo "  Backend API: http://localhost:8000/api"
echo ""
echo "💡 To seed the database with sample data, run:"
echo "  source .venv/bin/activate && python seed_data.py"