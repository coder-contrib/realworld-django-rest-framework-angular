# RealWorld Django + Angular - AI Agent Instructions

## Quick Start

This is a full-stack RealWorld application with Django backend and Angular frontend.

### Development Servers

- **Frontend (Angular)**: http://localhost:4200 - **USE THIS FOR DEVELOPMENT**
- **Backend (Django)**: http://localhost:8000 - Serves API and static files

### API Proxy Configuration

The Angular dev server includes a proxy configuration (`frontend/proxy.conf.json`) that routes all `/api/*` requests to the Django backend. This provides:

- **Seamless API access** - No CORS issues
- **Works everywhere** - Local development, Coder, any environment  
- **Single origin** - All requests appear to come from port 4200
- **Simple URLs** - Just use `/api` in your code

### How to Start/Stop Services

```bash
# Start both services
./start-dev.sh start

# Check status
./start-dev.sh status

# Stop all services
./start-dev.sh stop

# Restart services
./start-dev.sh restart
```

## 🎨 Color Changes

### ⚠️ IMPORTANT: Where to Make Changes

**ALWAYS use the Angular dev server (port 4200) for style changes!**

- ✅ **Correct**: http://localhost:4200 (instant hot reload)
- ❌ **Wrong**: http://localhost:8000 (requires rebuild)

### Changing Colors

Edit the SCSS variables in:

**File**: `frontend/src/styles/base/_variables.scss`

```scss
// Brand Colors
$brand-primary: #5CB85C;    // Main brand color (header, buttons)
$brand-danger: #B85C5C;     // Error/danger color
$brand-dark: #333;          // Dark text/elements
$brand-light: #f3f3f3;      // Light backgrounds
```

### Common Color Examples

```scss
/* Red header */
$brand-primary: #ff0000;

/* Blue header */
$brand-primary: #007bff;

/* Purple header */
$brand-primary: #6f42c1;

/* Orange header */
$brand-primary: #fd7e14;

/* Dark green header */
$brand-primary: #28a745;
```

### Testing Color Changes

1. **Make the change** in `frontend/src/styles/base/_variables.scss`
2. **View at** http://localhost:4200 (changes are instant)
3. **Take screenshot** to verify the change worked

## 📁 Project Structure

```
realworld-django-rest-framework-angular/
├── backend/                 # Django REST API
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/           # Angular components
│   │   ├── environments/  # Environment configuration
│   │   │   ├── environment.ts           # Production config
│   │   │   └── environment.development.ts # Development config
│   │   ├── styles/        # SCSS styling
│   │   │   ├── base/_variables.scss # Color variables
│   │   │   └── _realworld.scss     # Main styles import
│   │   └── styles.scss    # Global styles entry point
│   ├── proxy.conf.json    # API proxy configuration
│   └── dist/              # Built files (don't edit)
├── start-dev.sh           # Development server script
└── CLAUDE.md             # This file
```

## 🚀 Common Tasks

### Start Development
```bash
./start-dev.sh start
```

### Make Color Changes
1. Edit `frontend/src/styles/base/_variables.scss`
2. Change the `$brand-primary` value
3. View changes at http://localhost:4200

### Run Tests
```bash
cd frontend
npm test
```

### Build for Production
```bash
cd frontend
npm run build
```

## 🔧 Troubleshooting

### Colors Not Changing?
- ✅ Check you're viewing http://localhost:4200 (not 8000)
- ✅ Verify the Angular dev server is running (`tmux list-sessions`)
- ✅ Check for syntax errors in the SCSS file
- ✅ Try restarting the dev server: `./start-dev.sh restart`

### Services Not Starting?
```bash
# Check what's running
tmux list-sessions

# Stop everything and restart
./start-dev.sh stop
./start-dev.sh start
```

## 🎯 For AI Agents: Step-by-Step Color Change

1. **Verify services are running**: `./start-dev.sh status`
2. **Edit color file**: `frontend/src/styles/base/_variables.scss`
3. **Change the color**: Modify `$brand-primary` value
4. **View changes**: Navigate to http://localhost:4200
5. **Take screenshot**: Confirm the change is visible
6. **Save screenshot**: Use filename with timestamp for tracking

### Example Color Change Process

```bash
# 1. Check services
./start-dev.sh status

# 2. Edit the color (example: change to red)
# Edit frontend/src/styles/base/_variables.scss
# Change: $brand-primary: #ff0000;

# 3. View at http://localhost:4200
# 4. Take screenshot to verify
```

---

**Remember**: Always use http://localhost:4200 for development and style changes!