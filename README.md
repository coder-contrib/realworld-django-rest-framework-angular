# ![RealWorld Example App](logo.png)

> ### Django REST Framework + Angular codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

## 🚀 Coder-Enhanced Fork

This is a fork of [thanhdev/realworld-django-rest-framework-angular](https://github.com/thanhdev/realworld-django-rest-framework-angular) specifically enhanced for [Coder](https://coder.com) development environments and Claude Code tasks.

### ✨ Coder-Specific Enhancements

This fork includes the following improvements for seamless development in Coder workspaces:

- **🔧 Fixed ALLOWED_HOSTS**: Updated Django settings to work with Coder's dynamic URLs and port forwarding
- **🐍 Enhanced .gitignore**: Added comprehensive Python patterns to ignore `__pycache__/` and other Python artifacts
- **🌱 Database Seeding**: Added `seed_data.py` script to populate the database with sample articles, users, and comments
- **⚡ Smart Development Script**: Enhanced `start-dev.sh` with full lifecycle management (init, start, stop, restart, status)
- **🤖 Agent-Friendly**: Automated environment detection and setup - perfect for Claude Code and other AI assistants
- **📚 Sample Content**: Pre-loaded with 5 technical articles, 3 users, and realistic development content

### 🎯 Quick Start (Recommended)

**⚡ One-Command Setup** - The enhanced `start-dev.sh` script handles everything automatically:

```bash
# Clone and start everything in one command
git clone https://github.com/coder-contrib/realworld-django-rest-framework-angular.git
cd realworld-django-rest-framework-angular
./start-dev.sh
```

**That's it!** The script automatically:
- ✅ Creates Python virtual environment
- ✅ Installs all dependencies (Python + Node.js)
- ✅ Runs database migrations
- ✅ Seeds database with sample data
- ✅ Builds Angular frontend for Django static serving
- ✅ Starts both backend and frontend servers

**🎮 Available Commands:**
```bash
./start-dev.sh           # Start everything (default)
./start-dev.sh status    # Show what's running
./start-dev.sh stop      # Stop all services
./start-dev.sh restart   # Restart with fresh environment check
./start-dev.sh init      # Setup environment only (no start)
./start-dev.sh help      # Show all options
```

**🌐 Access Your App:**
- **Frontend (dev)**: http://localhost:4200 (with hot reload)
- **Django + Angular**: http://localhost:8000 (production-like)
- **Backend API**: http://localhost:8000/api

**🔑 Default Login Credentials:**
- Email: `alice@realworld.io` / Password: `password123`
- Email: `bob@realworld.io` / Password: `password123`
- Email: `charlie@realworld.io` / Password: `password123`

> **💡 For AI Assistants (Claude Code, etc.):** Always use `./start-dev.sh` instead of manual setup commands. It handles environment detection and prevents common issues like missing static files.

### [Demo](https://thanhdev.pythonanywhere.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)&nbsp;&nbsp;&nbsp;&nbsp;[Original Repo](https://github.com/thanhdev/realworld-django-rest-framework-angular)


This codebase was created to demonstrate a fully fledged fullstack application built with **Django REST Framework + Angular** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Django REST Framework + Angular** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

> See how the Medium.com clone (called Conduit) is built using Django REST Framework and Angular.

# Getting started

## Prerequisites
Ensure you have Python 3 and Node.js installed on your system. The current project dependency versions are:
- Python 3.10+
- Node.js 18.5.0+

> **⚡ Recommended:** Use the [Quick Start](#-quick-start-recommended) method with `./start-dev.sh` which handles all setup automatically.

## Alternative: Manual Installation

If you prefer manual setup or need to understand the individual steps:

### 1. Environment Setup
```shell
# Create Python virtual environment
python3 -m venv .venv
source .venv/bin/activate  # or .venv/Scripts/activate on Windows

# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
npm --prefix=frontend install
```

### 2. Database Setup
```shell
# Apply database migrations
python backend/manage.py migrate

# Seed with sample data (optional)
python seed_data.py
```

### 3. Frontend Build (Required for Django static serving)
```shell
# Build Angular for production (required for http://localhost:8000)
npm --prefix=frontend run build
```

### 4. Start Services
Choose one of these approaches:

**Option A: Development servers (recommended for development)**
```shell
# Terminal 1: Start Django backend
python backend/manage.py runserver 0.0.0.0:8000

# Terminal 2: Start Angular dev server (in new terminal)
npm --prefix=frontend start
```

**Option B: Using tmux (background services)**
```shell
# Start backend in tmux
tmux new-session -d -s backend 'source .venv/bin/activate && python backend/manage.py runserver 0.0.0.0:8000'

# Start frontend in tmux
tmux new-session -d -s frontend 'npm --prefix=frontend start'
```

### Access Points
- **Django + Angular (static)**: http://localhost:8000
- **Angular dev server**: http://localhost:4200 (if started separately)
- **API endpoints**: http://localhost:8000/api

## Troubleshooting

**❌ "TemplateDoesNotExist: index.html"**
- **Cause**: Angular frontend not built for Django static serving
- **Fix**: Run `npm --prefix=frontend run build` or use `./start-dev.sh restart`

**❌ "npm: command not found"**
- **Cause**: Node.js not installed
- **Fix**: Install Node.js 18.5.0+ from [nodejs.org](https://nodejs.org)

**❌ "python: command not found"**
- **Cause**: Python not installed or not in PATH
- **Fix**: Install Python 3.10+ and ensure it's in your PATH

**❌ Sessions not stopping properly**
- **Fix**: `tmux kill-server` to force-stop all tmux sessions

> **💡 Pro Tip:** The `./start-dev.sh` script prevents most of these issues by automatically detecting and fixing environment problems.
