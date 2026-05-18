<?php
/**
 * Car Clearance Management System - Main Entry Point
 * Routes all requests to appropriate controllers
 */

session_start();

// Load configuration and models
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Clearance.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ClearanceController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/ReportController.php';

// Get database connection
$db = getDB();

// Auto-create admin user if not exists
$userModel = new User($db);
if (!$userModel->findByUsername('admin')) {
    $userModel->create('admin', 'admin123', 'admin');
}

// Initialize controllers
$authController      = new AuthController($db);
$clearanceController = new ClearanceController($db);
$userController      = new UserController($db);
$reportController    = new ReportController($db);

// Route handling
$page   = $_GET['page'] ?? 'login';
$action = $_GET['action'] ?? 'index';
$id     = isset($_GET['id']) ? intval($_GET['id']) : 0;

switch ($page) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $authController->login();
        } else {
            $authController->showLogin();
        }
        break;

    case 'logout':
        $authController->logout();
        break;

    case 'dashboard':
        $clearanceController->index();
        break;

    case 'clearances':
        switch ($action) {
            case 'create':
                $clearanceController->create();
                break;
            case 'store':
                $clearanceController->store();
                break;
            case 'edit':
                $clearanceController->edit($id);
                break;
            case 'update':
                $clearanceController->update($id);
                break;
            case 'delete':
                $clearanceController->delete($id);
                break;
            default:
                $clearanceController->index();
        }
        break;

    case 'users':
        switch ($action) {
            case 'store':
                $userController->store();
                break;
            case 'update':
                $userController->update($id);
                break;
            case 'delete':
                $userController->delete($id);
                break;
            default:
                $userController->index();
        }
        break;

    case 'reports':
        switch ($action) {
            case 'print':
                $reportController->printReport();
                break;
            default:
                $reportController->index();
        }
        break;

    default:
        if (AuthController::isLoggedIn()) {
            header('Location: index.php?page=dashboard');
        } else {
            header('Location: index.php?page=login');
        }
        exit;
}
