# ![RealWorld Example App](logo.png)

> Django REST Framework + Angular codebase that implements the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

## About This Fork

This is a fork of [thanhdev/realworld-django-rest-framework-angular](https://github.com/thanhdev/realworld-django-rest-framework-angular) specifically enhanced to work seamlessly with [Coder](https://coder.com) development environments.

### What's Different

We've made several targeted improvements to ensure this RealWorld implementation works perfectly in remote development environments:

- **Remote Development Ready** - Fixed ALLOWED_HOSTS, X-Frame-Options, and CORS
- **Enhanced .gitignore** - Added Python patterns to ignore `__pycache__/` and artifacts
- **Database Seeding** - Added `seed_data.py` with 5 articles, 3 users, and realistic content
- **Smart Development Script** - Enhanced `start-dev.sh` with automated setup and lifecycle management
- **Modular CSS** - Refactored from hosted CSS to maintainable local SCSS
- **CLAUDE.md Documentation** - Added development instructions for AI assistants

### Getting Started

Clone and start everything in one command:

```bash
git clone https://github.com/coder-contrib/realworld-django-rest-framework-angular.git
cd realworld-django-rest-framework-angular
./start-dev.sh
```

The script automatically handles:
- Python virtual environment creation
- Dependencies installation (Python + Node.js)
- Database migrations
- Database seeding with sample data
- Angular frontend build for Django static serving
- Starting both backend and frontend servers

### Development Commands

```bash
./start-dev.sh           # Start everything (default)
./start-dev.sh status    # Show what's running
./start-dev.sh stop      # Stop all services
./start-dev.sh restart   # Restart with fresh environment check
./start-dev.sh init      # Setup environment only (no start)
./start-dev.sh help      # Show all options
```

### Access Your App

- **Frontend (dev)**: http://localhost:4200 (with hot reload and API proxy)
- **Django + Angular**: http://localhost:8000 (production-like)
- **Backend API**: http://localhost:8000/api

> **Note for Coder users:** Use the port 4200 preview URL for the best development experience. The Angular dev server includes an API proxy that handles all backend requests seamlessly.

### Default Login Credentials

- Email: `alice@realworld.io` / Password: `password123`
- Email: `bob@realworld.io` / Password: `password123`
- Email: `charlie@realworld.io` / Password: `password123`

### [Demo](https://thanhdev.pythonanywhere.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)&nbsp;&nbsp;&nbsp;&nbsp;[Original Repo](https://github.com/thanhdev/realworld-django-rest-framework-angular)

## How it works

This codebase demonstrates a fully fledged fullstack application built with Django REST Framework + Angular including CRUD operations, authentication, routing, pagination, and more.

The implementation follows Django REST Framework and Angular community styleguides & best practices. For more information on how this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## Manual Installation

The `./start-dev.sh` script handles all setup automatically, but if you prefer manual setup:

### Prerequisites
- Python 3.10+
- Node.js 18.5.0+

### Setup Steps

1. **Environment Setup**
   ```shell
   python3 -m venv .venv
   source .venv/bin/activate  # or .venv/Scripts/activate on Windows
   pip install -r backend/requirements.txt
   npm --prefix=frontend install
   ```

2. **Database Setup**
   ```shell
   python backend/manage.py migrate
   python seed_data.py  # Optional: adds sample data
   ```

3. **Frontend Build**
   ```shell
   npm --prefix=frontend run build  # Required for Django static serving
   ```

4. **Start Services**
   ```shell
   # Terminal 1: Django backend
   python backend/manage.py runserver 0.0.0.0:8000
   
   # Terminal 2: Angular dev server
   npm --prefix=frontend start
   ```

The Angular dev server (port 4200) includes a proxy configuration that automatically routes `/api/*` requests to the Django backend, preventing CORS issues.

## Styling Architecture

The application uses a maintainable SCSS structure with local CSS instead of external hosted CSS:

### Directory Structure
```
frontend/src/styles/
├── _realworld.scss       # Main entry point
├── bootstrap-base.css    # Bootstrap 4 alpha base styles
├── base/                 # Foundation styles
│   ├── _variables.scss   # Theme colors and variables
│   └── _base.scss        # Global base styles
├── components/           # Component-specific styles
│   ├── _articles.scss    # Article preview and page styles
│   ├── _buttons.scss     # Button customizations
│   ├── _comments.scss    # Comment component styles
│   ├── _layout.scss      # Banner, footer, layout components
│   ├── _navigation.scss  # Navbar and navigation styles
│   └── _tags.scss        # Tag component styles
└── pages/                # Page-specific styles
    ├── _home.scss        # Home page banner and sidebar
    ├── _profile.scss     # User profile page styles
    └── _editor.scss      # Article editor page styles
```

### Available Variables
```scss
$brand-primary: #5CB85C;     // Main green color
$brand-danger: #B85C5C;      // Error/danger color
$brand-dark: #333;           // Dark backgrounds
$brand-light: #f3f3f3;       // Light backgrounds
$font-family-logo: "Titillium Web", sans-serif;
$font-family-content: 'Source Serif Pro', serif;
$text-muted: #bbb;           // Muted text color
$tag-muted-color: #aaa;      // Tag text color
```

## Troubleshooting

**"TemplateDoesNotExist: index.html"**
- Angular frontend not built for Django static serving
- Fix: Run `npm --prefix=frontend run build` or use `./start-dev.sh restart`

**"npm: command not found"**
- Node.js not installed
- Fix: Install Node.js 18.5.0+ from [nodejs.org](https://nodejs.org)

**"python: command not found"**
- Python not installed or not in PATH
- Fix: Install Python 3.10+ and ensure it's in your PATH

**Sessions not stopping properly**
- Fix: `tmux kill-server` to force-stop all tmux sessions

The `./start-dev.sh` script prevents most of these issues by automatically detecting and fixing environment problems.
