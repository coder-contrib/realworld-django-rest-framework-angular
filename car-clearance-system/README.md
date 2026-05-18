# Car Clearance Management System

A full-stack web application for managing car/truck clearance records, built with PHP 8+, MySQL, HTML, CSS, JavaScript, and Bootstrap 5.

## Features

- **Authentication & Authorization**: Secure login with role-based access (Admin/User)
- **Clearance Records**: Add, view, edit, and delete car clearance records
- **Dual Currency Support**: Track payments in USD or SSP
- **Reports**: Filterable, searchable, sortable reports with print functionality
- **User Management**: Admins can create, edit, and delete users
- **Responsive Design**: Mobile-friendly layout with Bootstrap 5
- **Security**: PDO prepared statements, password hashing, input validation

## Requirements

- PHP 8.0+
- MySQL 5.7+ / MariaDB 10.3+
- Apache with mod_rewrite (XAMPP, Laragon, WAMP, etc.)

## Setup Instructions

### Option A: Using XAMPP

1. **Install XAMPP** from [https://www.apachefriends.org/](https://www.apachefriends.org/)

2. **Copy project files** to your XAMPP htdocs folder:
   ```
   Copy the entire `car-clearance-system` folder to:
   C:\xampp\htdocs\car-clearance-system
   ```

3. **Start Apache and MySQL** from XAMPP Control Panel.

4. **Create the database**:
   - Open phpMyAdmin: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
   - Click "Import" tab
   - Select `database/schema.sql` file
   - Click "Go" to execute

   **Or** run from command line:
   ```bash
   mysql -u root < database/schema.sql
   ```

5. **Update database config** (if needed):
   - Edit `config/database.php`
   - Update `DB_HOST`, `DB_USER`, `DB_PASS` if different from defaults

6. **Access the application**:
   - Navigate to: [http://localhost/car-clearance-system/public/](http://localhost/car-clearance-system/public/)
   - Login with: **admin** / **admin123**

### Option B: Using Laragon

1. **Install Laragon** from [https://laragon.org/](https://laragon.org/)

2. **Copy project files** to Laragon's www folder:
   ```
   Copy to: C:\laragon\www\car-clearance-system
   ```

3. **Start All** services in Laragon.

4. **Create the database**:
   - Open Laragon Terminal
   - Run: `mysql -u root < database/schema.sql`
   - Or use HeidiSQL (included with Laragon) to import `database/schema.sql`

5. **Access the application**:
   - Navigate to: [http://car-clearance-system.test/public/](http://car-clearance-system.test/public/)
   - Or: [http://localhost/car-clearance-system/public/](http://localhost/car-clearance-system/public/)
   - Login with: **admin** / **admin123**

### Option C: PHP Built-in Server (Quick Testing)

```bash
cd car-clearance-system/public
php -S localhost:8080
```
Then visit: [http://localhost:8080](http://localhost:8080)

> Note: Ensure MySQL is running separately and the database is imported.

## Project Structure

```
car-clearance-system/
├── config/
│   └── database.php          # Database connection configuration
├── controllers/
│   ├── AuthController.php    # Authentication (login/logout)
│   ├── ClearanceController.php # Clearance CRUD operations
│   ├── UserController.php    # User management (admin)
│   └── ReportController.php  # Report generation
├── models/
│   ├── User.php              # User model (database queries)
│   └── Clearance.php         # Clearance model (database queries)
├── views/
│   ├── layouts/
│   │   ├── header.php        # HTML head & opening tags
│   │   ├── sidebar.php       # Navigation sidebar
│   │   └── footer.php        # Scripts & closing tags
│   ├── auth/
│   │   └── login.php         # Login page
│   ├── dashboard/
│   │   └── index.php         # Main dashboard view
│   ├── clearances/
│   │   └── form.php          # Add/Edit clearance form
│   ├── users/
│   │   └── list.php          # User management page
│   └── reports/
│       ├── index.php         # Reports with filters
│       └── print.php         # Print-friendly report
├── public/
│   ├── index.php             # Application entry point / router
│   ├── css/
│   │   └── style.css         # Custom styles
│   └── js/
│       └── app.js            # Client-side JavaScript
├── database/
│   └── schema.sql            # Database schema & seed data
├── .htaccess                 # Apache URL rewriting
└── README.md                 # This file
```

## Default Login Credentials

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin123 | Admin |

## User Roles

| Permission              | Admin | User |
|------------------------|-------|------|
| View clearance records | Yes   | Yes  |
| Add clearance records  | Yes   | Yes  |
| Edit clearance records | Yes   | No   |
| Delete clearance records| Yes  | No   |
| View reports           | Yes   | Yes  |
| Print reports          | Yes   | Yes  |
| Manage users           | Yes   | No   |

## Currency Logic

- **Paid in USD**: The USD amount is stored; SSP is set to 0
- **Paid in SSP**: The SSP amount is stored; USD is set to 0
- A radio button controls which currency field is active
- Server-side validation ensures only one currency has a value > 0

## Troubleshooting

### "Access Denied" database error
- Check `config/database.php` credentials match your MySQL setup
- XAMPP default: user=`root`, password=`` (empty)
- Laragon default: user=`root`, password=`` (empty)

### "Table doesn't exist" error
- Import `database/schema.sql` into MySQL first
- The application will auto-create the admin user if it doesn't exist

### Page not found / 404
- Ensure Apache `mod_rewrite` is enabled
- Check that `.htaccess` file is present in the root folder
- Try accessing directly: `http://localhost/car-clearance-system/public/index.php`

### Styles not loading
- Access via `public/index.php` (not root `index.php`)
- Check browser console for 404 errors on CSS/JS files

## Security Features

- **Password Hashing**: Uses `password_hash()` with `PASSWORD_DEFAULT` (bcrypt)
- **SQL Injection Prevention**: All queries use PDO prepared statements
- **XSS Prevention**: All output escaped with `htmlspecialchars()`
- **Session Security**: PHP sessions for authentication state
- **Input Validation**: Both client-side (HTML5/JS) and server-side (PHP)
- **Role-Based Access**: Admin/User permissions enforced server-side

## License

This project is provided as-is for educational and business purposes.
