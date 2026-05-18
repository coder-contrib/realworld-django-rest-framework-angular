<!-- Sidebar Navigation -->
<nav class="sidebar">
    <div class="sidebar-header">
        <h3><i class="bi bi-truck"></i> Car Clearance</h3>
        <small>Management System</small>
    </div>
    <ul class="nav-list">
        <li>
            <a href="index.php?page=dashboard" class="<?= ($page ?? '') === 'dashboard' ? 'active' : '' ?>">
                <i class="bi bi-speedometer2"></i> Dashboard
            </a>
        </li>
        <li>
            <a href="index.php?page=clearances&action=create" class="<?= ($page ?? '') === 'clearances' && ($action ?? '') === 'create' ? 'active' : '' ?>">
                <i class="bi bi-plus-circle"></i> New Clearance
            </a>
        </li>
        <li>
            <a href="index.php?page=reports" class="<?= ($page ?? '') === 'reports' ? 'active' : '' ?>">
                <i class="bi bi-file-earmark-bar-graph"></i> Reports
            </a>
        </li>
        <?php if (AuthController::isAdmin()): ?>
        <li>
            <a href="index.php?page=users" class="<?= ($page ?? '') === 'users' ? 'active' : '' ?>">
                <i class="bi bi-people"></i> Manage Users
            </a>
        </li>
        <?php endif; ?>
        <li>
            <a href="index.php?page=logout">
                <i class="bi bi-box-arrow-right"></i> Logout
            </a>
        </li>
    </ul>
    <div class="user-info">
        <i class="bi bi-person-circle"></i>
        <?= htmlspecialchars($_SESSION['username'] ?? '') ?>
        <span class="badge bg-<?= ($_SESSION['role'] ?? '') === 'admin' ? 'danger' : 'info' ?> ms-2">
            <?= ucfirst($_SESSION['role'] ?? '') ?>
        </span>
    </div>
</nav>
