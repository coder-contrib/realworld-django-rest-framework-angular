<?php include __DIR__ . '/../layouts/header.php'; ?>
<?php include __DIR__ . '/../layouts/sidebar.php'; ?>

<!-- Main Content -->
<div class="main-content">
    <!-- Mobile toggle -->
    <button class="btn btn-dark d-md-none mb-3 no-print" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <div class="page-header d-flex justify-content-between align-items-center">
        <h2><i class="bi bi-speedometer2"></i> Dashboard</h2>
        <a href="index.php?page=clearances&action=create" class="btn btn-primary no-print">
            <i class="bi bi-plus-circle"></i> New Clearance
        </a>
    </div>

    <?php if (!empty($_SESSION['success'])): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <?= $_SESSION['success']; unset($_SESSION['success']); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <?php if (!empty($_SESSION['error'])): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= $_SESSION['error']; unset($_SESSION['error']); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- Summary Cards -->
    <div class="row mb-4">
        <div class="col-md-4 mb-3">
            <div class="card stat-card">
                <div class="card-body d-flex align-items-center">
                    <div class="stat-icon bg-primary me-3">
                        <i class="bi bi-file-text"></i>
                    </div>
                    <div>
                        <div class="stat-value"><?= $totals['total_records'] ?? 0 ?></div>
                        <div class="stat-label">Total Records</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card stat-card">
                <div class="card-body d-flex align-items-center">
                    <div class="stat-icon bg-success me-3">
                        <i class="bi bi-currency-dollar"></i>
                    </div>
                    <div>
                        <div class="stat-value">$<?= number_format($totals['total_usd'] ?? 0, 2) ?></div>
                        <div class="stat-label">Total USD</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card stat-card">
                <div class="card-body d-flex align-items-center">
                    <div class="stat-icon bg-info me-3">
                        <i class="bi bi-cash"></i>
                    </div>
                    <div>
                        <div class="stat-value"><?= number_format($totals['total_ssp'] ?? 0, 2) ?> SSP</div>
                        <div class="stat-label">Total SSP</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="filter-card no-print">
        <form method="GET" class="row g-3 align-items-end">
            <input type="hidden" name="page" value="dashboard">
            <div class="col-md-3">
                <label for="date_from" class="form-label">From Date</label>
                <input type="date" class="form-control" id="date_from" name="date_from"
                       value="<?= htmlspecialchars($dateFrom ?? '') ?>">
            </div>
            <div class="col-md-3">
                <label for="date_to" class="form-label">To Date</label>
                <input type="date" class="form-control" id="date_to" name="date_to"
                       value="<?= htmlspecialchars($dateTo ?? '') ?>">
            </div>
            <div class="col-md-3">
                <label for="truck_number" class="form-label">Truck Number</label>
                <input type="text" class="form-control" id="truck_number" name="truck_number"
                       placeholder="Search truck..." value="<?= htmlspecialchars($truckNumber ?? '') ?>">
            </div>
            <div class="col-md-3">
                <button type="submit" class="btn btn-primary me-2">
                    <i class="bi bi-search"></i> Filter
                </button>
                <a href="index.php?page=dashboard" class="btn btn-secondary">
                    <i class="bi bi-x-circle"></i> Clear
                </a>
            </div>
        </form>
    </div>

    <!-- Quick Search -->
    <div class="mb-3 no-print">
        <input type="text" id="tableSearch" class="form-control" placeholder="Quick search in table...">
    </div>

    <!-- Records Table -->
    <div class="table-container">
        <div class="table-responsive">
            <table class="table table-hover" id="dataTable">
                <thead>
                    <tr>
                        <th data-sort="text">#</th>
                        <th data-sort="text">Date</th>
                        <th data-sort="text">Truck No.</th>
                        <th data-sort="text">Consignment</th>
                        <th data-sort="text">Truck Type</th>
                        <th data-sort="number">USD</th>
                        <th data-sort="number">SSP</th>
                        <th data-sort="text">Cleared By</th>
                        <?php if (AuthController::isAdmin()): ?>
                        <th class="no-print">Actions</th>
                        <?php endif; ?>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($records)): ?>
                    <tr>
                        <td colspan="<?= AuthController::isAdmin() ? 9 : 8 ?>" class="text-center text-muted py-4">
                            <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                            <p class="mt-2 mb-0">No records found.</p>
                        </td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($records as $i => $r): ?>
                    <tr>
                        <td><?= $i + 1 ?></td>
                        <td><?= htmlspecialchars($r['clearance_date']) ?></td>
                        <td><strong><?= htmlspecialchars($r['truck_number']) ?></strong></td>
                        <td><?= htmlspecialchars($r['consignment']) ?></td>
                        <td><span class="badge bg-secondary badge-truck"><?= htmlspecialchars($r['truck_type']) ?></span></td>
                        <td class="amount-usd"><?= $r['amount_usd'] > 0 ? '$' . number_format($r['amount_usd'], 2) : '-' ?></td>
                        <td class="amount-ssp"><?= $r['amount_ssp'] > 0 ? number_format($r['amount_ssp'], 2) . ' SSP' : '-' ?></td>
                        <td><?= htmlspecialchars($r['cleared_by_username']) ?></td>
                        <?php if (AuthController::isAdmin()): ?>
                        <td class="no-print">
                            <a href="index.php?page=clearances&action=edit&id=<?= $r['id'] ?>" class="btn btn-sm btn-outline-primary" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </a>
                            <a href="index.php?page=clearances&action=delete&id=<?= $r['id'] ?>" class="btn btn-sm btn-outline-danger btn-delete" title="Delete">
                                <i class="bi bi-trash"></i>
                            </a>
                        </td>
                        <?php endif; ?>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php include __DIR__ . '/../layouts/footer.php'; ?>
