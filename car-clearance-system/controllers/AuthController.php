<?php
/**
 * Authentication Controller
 * Handles login, logout, and session management
 */
class AuthController {
    private $userModel;

    public function __construct(PDO $db) {
        $this->userModel = new User($db);
    }

    /**
     * Show login page
     */
    public function showLogin(): void {
        // Redirect if already logged in
        if ($this->isLoggedIn()) {
            header('Location: index.php?page=dashboard');
            exit;
        }
        include __DIR__ . '/../views/auth/login.php';
    }

    /**
     * Process login form
     */
    public function login(): void {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        // Validate inputs
        if (empty($username) || empty($password)) {
            $_SESSION['error'] = 'Username and password are required.';
            header('Location: index.php?page=login');
            exit;
        }

        // Find user
        $user = $this->userModel->findByUsername($username);
        if (!$user || !$this->userModel->verifyPassword($user, $password)) {
            $_SESSION['error'] = 'Invalid username or password.';
            header('Location: index.php?page=login');
            exit;
        }

        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        $_SESSION['success'] = 'Welcome back, ' . htmlspecialchars($user['username']) . '!';
        header('Location: index.php?page=dashboard');
        exit;
    }

    /**
     * Logout
     */
    public function logout(): void {
        session_destroy();
        session_start();
        $_SESSION['success'] = 'You have been logged out.';
        header('Location: index.php?page=login');
        exit;
    }

    /**
     * Check if user is logged in
     */
    public static function isLoggedIn(): bool {
        return isset($_SESSION['user_id']);
    }

    /**
     * Check if current user is admin
     */
    public static function isAdmin(): bool {
        return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
    }

    /**
     * Require login - redirect if not authenticated
     */
    public static function requireLogin(): void {
        if (!self::isLoggedIn()) {
            $_SESSION['error'] = 'Please log in to access this page.';
            header('Location: index.php?page=login');
            exit;
        }
    }

    /**
     * Require admin role
     */
    public static function requireAdmin(): void {
        self::requireLogin();
        if (!self::isAdmin()) {
            $_SESSION['error'] = 'Access denied. Admin privileges required.';
            header('Location: index.php?page=dashboard');
            exit;
        }
    }
}
