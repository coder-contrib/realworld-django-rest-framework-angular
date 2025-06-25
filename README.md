# ![RealWorld Example App](logo.png)

> ### Django REST Framework + Angular codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

## 🚀 Coder-Enhanced Fork

This is a fork of [thanhdev/realworld-django-rest-framework-angular](https://github.com/thanhdev/realworld-django-rest-framework-angular) specifically enhanced for [Coder](https://coder.com) development environments and Claude Code tasks.

### ✨ Coder-Specific Enhancements

This fork includes the following improvements for seamless development in Coder workspaces:

- **🔧 Fixed ALLOWED_HOSTS**: Updated Django settings to work with Coder's dynamic URLs and port forwarding
- **🐍 Enhanced .gitignore**: Added comprehensive Python patterns to ignore `__pycache__/` and other Python artifacts
- **🌱 Database Seeding**: Added `seed_data.py` script to populate the database with sample articles, users, and comments
- **⚡ Quick Start Script**: Added `start-dev.sh` for one-command setup of both frontend and backend servers in tmux
- **📚 Sample Content**: Pre-loaded with 5 technical articles, 3 users, and realistic development content

### 🎯 Quick Start for Coder

```bash
# Clone and start everything
git clone https://github.com/coder-contrib/realworld-django-rest-framework-angular.git
cd realworld-django-rest-framework-angular
./start-dev.sh

# Seed the database with sample data
source .venv/bin/activate && python seed_data.py
```

**Default Login Credentials:**
- Email: `alice@realworld.io` / Password: `password123`
- Email: `bob@realworld.io` / Password: `password123`
- Email: `charlie@realworld.io` / Password: `password123`

### [Demo](https://thanhdev.pythonanywhere.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)&nbsp;&nbsp;&nbsp;&nbsp;[Original Repo](https://github.com/thanhdev/realworld-django-rest-framework-angular)


This codebase was created to demonstrate a fully fledged fullstack application built with **Django REST Framework + Angular** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Django REST Framework + Angular** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

> See how the Medium.com clone (called Conduit) is built using Django REST Framework and Angular.

# Getting started

## Prerequisites
Ensure you have Python 3 and Node.js installed on your system. The current project dependency versions are:
- Python 3.10
- Node.js 18.5.0

## Installation
### 1. Frontend: Choose 1 of 2 ways below:
- Install frontend dependencies and start frontend locally:
```shell
npm --prefix=frontend install
npm --prefix=frontend start
```
This command will install and start the Angular development server. You can access the Angular application through your web browser at `http://localhost:4200`.

- Install and build frontend as static files (Choose this if you don't want to make any changes to Frontend project):
```shell
npm --prefix=frontend install
npm --prefix=frontend run build
```

### 2. Backend:
- Set up a virtual environment
```shell
# Install environment and dependencies
python3 -m venv .venv
source .venv/bin/activate

# or use this command on Windows
python3 -m venv .venv
.venv/Scripts/activate
```

- Install backend dependencies:
```shell
pip install -r backend/requirements.txt
```

- Apply database migrations:
```shell
# Apply migrations
python backend/manage.py migrate
```

- Run the Django development server:
```shell
# Run server
python backend/manage.py runserver
```

Now, your local server should be running, and you can access this Django/Angular application through your web browser at http://localhost:8000.
