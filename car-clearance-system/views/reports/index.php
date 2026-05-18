<?php include __DIR__ . '/../layouts/header.php'; ?>
<?php include __DIR__ . '/../layouts/sidebar.php'; ?>

<!-- Main Content -->
<div class="main-content">
    <button class="btn btn-dark d-md-none mb-3" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <div class="page-header d-flex justify-content-between align-items-center">
        <h2><i class="bi bi-file-earmark-bar-graph"></i> Reports</h2>
        <a href="index.php?page=reports&action=print&date_from=<?= urlencode($dateFrom ?? '') ?>&date_to=<?= urlencode($dateTo ?? '') ?>&truck_number=<?= urlencode($truckNumber ?? '') ?>"
           class="btn btn-success no-print" target="_blank">
            <i class="bi bi-printer"></i> Print Report
        </a>
    </div>

    <?php if (!empty($_SESSION['error'])): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= $_SESSION['error']; unset($_SESSION['error']); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <!-- Filters -->
    <div class="filter-card no-print">
        <h5 class="mb-3"><i class="bi bi-funnel"></i> Report Filters</h5>
        <form method="GET" class="row g-3 align-items-end">
            <input type="hidden" name="page" value="reports">
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
                       placeholder="Filter by truck..." value="<?= htmlspecialchars($truckNumber ?? '') ?>">
            </div>
            <div class="col-md-3">
                <button type="submit" class="btn btn-primary me-2">
                    <i class="bi bi-search"></i> Generate
                </button>
                <a href="index.php?page=reports" class="btn btn-secondary">
                    <i class="bi bi-x-circle"></i> Clear
                </a>
            </div>
        </form>
    </div>

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
                        <div class="stat-label">Total USD Collected</div>
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
                        <div class="stat-label">Total SSP Collected</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Report Table -->
    <div class="table-container">
        <div class="table-responsive">
            <table class="table table-hover table-striped" id="dataTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Truck No.</th>
                        <th>Consignment</th>
                        <th>Items</th>
                        <th>Truck Type</th>
                        <th>USD</th>
                        <th>SSP</th>
                        <th>Cleared By</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($records)): ?>
                    <tr>
                        <td colspan="9" class="text-center text-muted py-4">
                            <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                            <p class="mt-2 mb-0">No records found. Adjust your filters.</p>
                        </td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($records as $i => $r): ?>
                    <tr>
                        <td><?= $i + 1 ?></td>
                        <td><?= htmlspecialchars($r['clearance_date']) ?></td>
                        <td><strong><?= htmlspecialchars($r['truck_number']) ?></strong></td>
                        <td><?= htmlspecialchars($r['consignment']) ?></td>
                        <td><?= htmlspecialchars(mb_strimwidth($r['items'], 0, 50, '...')) ?></td>
                        <td><span class="badge bg-secondary"><?= htmlspecialchars($r['truck_type']) ?></span></td>
                        <td class="amount-usd"><?= $r['amount_usd'] > 0 ? '$' . number_format($r['amount_usd'], 2) : '-' ?></td>
                        <td class="amount-ssp"><?= $r['amount_ssp'] > 0 ? number_format($r['amount_ssp'], 2) . ' SSP' : '-' ?></td>
                        <td><?= htmlspecialchars($r['cleared_by_username']) ?></td>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
                <?php if (!empty($records)): ?>
                <tfoot>
                    <tr class="table-dark">
                        <td colspan="6" class="text-end"><strong>TOTALS:</strong></td>
                        <td class="amount-usd"><strong>$<?= number_format($totals['total_usd'], 2) ?></strong></td>
                        <td class="amount-ssp"><strong><?= number_format($totals['total_ssp'], 2) ?> SSP</strong></td>
                        <td></td>
                    </tr>
                </tfoot>
                <?php endif; ?>
            </table>
        </div>
    </div>
</div>

<?php include __DIR__ . '/../layouts/footer.php'; ?>
