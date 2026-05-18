<?php
/**
 * User Controller
 * Handles CRUD operations for user management (admin only)
 */
class UserController {
    private $userModel;

    public function __construct(PDO $db) {
        $this->userModel = new User($db);
    }

    /**
     * List all users
     */
    public function index(): void {
        AuthController::requireAdmin();
        $users = $this->userModel->getAll();
        include __DIR__ . '/../views/users/list.php';
    }

    /**
     * Store a new user
     */
    public function store(): void {
        AuthController::requireAdmin();

        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $role     = $_POST['role'] ?? 'user';

        // Validate
        $errors = [];
        if (empty($username)) {
            $errors[] = 'Username is required.';
        }
        if (strlen($username) < 3) {
            $errors[] = 'Username must be at least 3 characters.';
        }
        if (empty($password)) {
            $errors[] = 'Password is required.';
        }
        if (strlen($password) < 6) {
            $errors[] = 'Password must be at least 6 characters.';
        }
        if (!in_array($role, ['admin', 'user'])) {
            $errors[] = 'Invalid role.';
        }
        // Check username uniqueness
        if ($this->userModel->findByUsername($username)) {
            $errors[] = 'Username already exists.';
        }

        if (!empty($errors)) {
            $_SESSION['error'] = implode('<br>', $errors);
            header('Location: index.php?page=users');
            exit;
        }

        if ($this->userModel->create($username, $password, $role)) {
            $_SESSION['success'] = 'User created successfully.';
        } else {
            $_SESSION['error'] = 'Failed to create user.';
        }
        header('Location: index.php?page=users');
        exit;
    }

    /**
     * Update a user
     */
    public function update(int $id): void {
        AuthController::requireAdmin();

        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $role     = $_POST['role'] ?? 'user';

        // Validate
        $errors = [];
        if (empty($username)) {
            $errors[] = 'Username is required.';
        }
        if (!in_array($role, ['admin', 'user'])) {
            $errors[] = 'Invalid role.';
        }
        // Check username uniqueness (exclude current user)
        $existing = $this->userModel->findByUsername($username);
        if ($existing && $existing['id'] != $id) {
            $errors[] = 'Username already exists.';
        }

        if (!empty($errors)) {
            $_SESSION['error'] = implode('<br>', $errors);
            header('Location: index.php?page=users');
            exit;
        }

        $pass = !empty($password) ? $password : null;
        if ($this->userModel->update($id, $username, $role, $pass)) {
            $_SESSION['success'] = 'User updated successfully.';
        } else {
            $_SESSION['error'] = 'Failed to update user.';
        }
        header('Location: index.php?page=users');
        exit;
    }

    /**
     * Delete a user
     */
    public function delete(int $id): void {
        AuthController::requireAdmin();

        // Prevent deleting own account
        if ($id == $_SESSION['user_id']) {
            $_SESSION['error'] = 'You cannot delete your own account.';
            header('Location: index.php?page=users');
            exit;
        }

        if ($this->userModel->delete($id)) {
            $_SESSION['success'] = 'User deleted successfully.';
        } else {
            $_SESSION['error'] = 'Failed to delete user.';
        }
        header('Location: index.php?page=users');
        exit;
    }
}
