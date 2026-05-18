-- Car Clearance Management System Database Schema
-- Run this SQL file to set up the database

CREATE DATABASE IF NOT EXISTS car_clearance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE car_clearance_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Car clearances table
CREATE TABLE IF NOT EXISTS car_clearances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clearance_date DATE NOT NULL,
    truck_number VARCHAR(50) NOT NULL,
    consignment VARCHAR(255) NOT NULL,
    items TEXT,
    truck_type ENUM('Fuso', 'Trailer', 'Canter', 'Tipper', 'Pickup', 'Other') NOT NULL,
    amount_usd DECIMAL(12,2) DEFAULT 0.00,
    amount_ssp DECIMAL(12,2) DEFAULT 0.00,
    paid_in_currency ENUM('USD', 'SSP') NOT NULL,
    cleared_by_username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_clearance_date (clearance_date),
    INDEX idx_truck_number (truck_number),
    INDEX idx_cleared_by (cleared_by_username)
) ENGINE=InnoDB;

-- The default admin user will be auto-created by the application on first run.
-- Username: admin, Password: admin123
-- If you prefer to insert manually, generate a hash with:
--   php -r "echo password_hash('admin123', PASSWORD_DEFAULT);"
-- Then run:
--   INSERT INTO users (username, password_hash, role) VALUES ('admin', '<hash>', 'admin');
