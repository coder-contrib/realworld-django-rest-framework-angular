<?php
/**
 * User Model
 * Handles all database operations for users
 */
class User {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Find user by username
     */
    public function findByUsername(string $username): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    /**
     * Find user by ID
     */
    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    /**
     * Get all users
     */
    public function getAll(): array {
        $stmt = $this->db->query("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    /**
     * Create a new user
     */
    public function create(string $username, string $password, string $role = 'user'): bool {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare(
            "INSERT INTO users (username, password_hash, role) VALUES (:username, :password_hash, :role)"
        );
        return $stmt->execute([
            'username'      => $username,
            'password_hash' => $hash,
            'role'          => $role,
        ]);
    }

    /**
     * Update a user
     */
    public function update(int $id, string $username, string $role, ?string $password = null): bool {
        if ($password) {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $this->db->prepare(
                "UPDATE users SET username = :username, password_hash = :hash, role = :role WHERE id = :id"
            );
            return $stmt->execute(['username' => $username, 'hash' => $hash, 'role' => $role, 'id' => $id]);
        } else {
            $stmt = $this->db->prepare(
                "UPDATE users SET username = :username, role = :role WHERE id = :id"
            );
            return $stmt->execute(['username' => $username, 'role' => $role, 'id' => $id]);
        }
    }

    /**
     * Delete a user
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    /**
     * Verify password for a user
     */
    public function verifyPassword(array $user, string $password): bool {
        return password_verify($password, $user['password_hash']);
    }
}
