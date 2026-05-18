<?php include __DIR__ . '/../layouts/header.php'; ?>
<?php include __DIR__ . '/../layouts/sidebar.php'; ?>

<?php
$isEdit = !empty($record);
$title = $isEdit ? 'Edit Clearance Record' : 'New Clearance Record';
$actionUrl = $isEdit
    ? 'index.php?page=clearances&action=update&id=' . $record['id']
    : 'index.php?page=clearances&action=store';

// Get old input (after validation errors)
$old = $_SESSION['old_input'] ?? [];
unset($_SESSION['old_input']);

// Merge record data with old input (old takes priority)
$data = array_merge($record ?? [], $old);
?>

<!-- Main Content -->
<div class="main-content">
    <button class="btn btn-dark d-md-none mb-3" id="sidebarToggle">
        <i class="bi bi-list"></i>
    </button>

    <div class="page-header">
        <h2><i class="bi bi-<?= $isEdit ? 'pencil' : 'plus-circle' ?>"></i> <?= $title ?></h2>
    </div>

    <?php if (!empty($_SESSION['error'])): ?>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <?= $_SESSION['error']; unset($_SESSION['error']); ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="table-container">
        <form method="POST" action="<?= $actionUrl ?>" id="clearanceForm" class="needs-validation" novalidate>
            <div class="row">
                <!-- Date -->
                <div class="col-md-6 mb-3">
                    <label for="clearance_date" class="form-label">Date <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" id="clearance_date" name="clearance_date"
                           value="<?= htmlspecialchars($data['clearance_date'] ?? date('Y-m-d')) ?>" required>
                    <div class="invalid-feedback">Date is required.</div>
                </div>

                <!-- Truck Number -->
                <div class="col-md-6 mb-3">
                    <label for="truck_number" class="form-label">Truck Number <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="truck_number" name="truck_number"
                           value="<?= htmlspecialchars($data['truck_number'] ?? '') ?>"
                           placeholder="e.g., SSD 123A" required>
                    <div class="invalid-feedback">Truck number is required.</div>
                </div>

                <!-- Consignment -->
                <div class="col-md-6 mb-3">
                    <label for="consignment" class="form-label">Consignment <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="consignment" name="consignment"
                           value="<?= htmlspecialchars($data['consignment'] ?? '') ?>"
                           placeholder="Consignment details" required>
                    <div class="invalid-feedback">Consignment is required.</div>
                </div>

                <!-- Truck Type -->
                <div class="col-md-6 mb-3">
                    <label for="truck_type" class="form-label">Type of Truck <span class="text-danger">*</span></label>
                    <select class="form-select" id="truck_type" name="truck_type" required>
                        <option value="">-- Select Type --</option>
                        <?php
                        $types = ['Fuso', 'Trailer', 'Canter', 'Tipper', 'Pickup', 'Other'];
                        foreach ($types as $type):
                        ?>
                        <option value="<?= $type ?>" <?= ($data['truck_type'] ?? '') === $type ? 'selected' : '' ?>>
                            <?= $type ?>
                        </option>
                        <?php endforeach; ?>
                    </select>
                    <div class="invalid-feedback">Please select a truck type.</div>
                </div>

                <!-- Items -->
                <div class="col-12 mb-3">
                    <label for="items" class="form-label">Items</label>
                    <textarea class="form-control" id="items" name="items" rows="3"
                              placeholder="List items being transported..."><?= htmlspecialchars($data['items'] ?? '') ?></textarea>
                </div>

                <!-- Payment Currency -->
                <div class="col-12 mb-3">
                    <label class="form-label">Paid In <span class="text-danger">*</span></label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="paid_in_currency"
                                   id="paid_usd" value="USD"
                                   <?= ($data['paid_in_currency'] ?? 'USD') === 'USD' ? 'checked' : '' ?>>
                            <label class="form-check-label" for="paid_usd">
                                <i class="bi bi-currency-dollar"></i> USD
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="paid_in_currency"
                                   id="paid_ssp" value="SSP"
                                   <?= ($data['paid_in_currency'] ?? '') === 'SSP' ? 'checked' : '' ?>>
                            <label class="form-check-label" for="paid_ssp">
                                <i class="bi bi-cash"></i> SSP
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Amount USD -->
                <div class="col-md-6 mb-3">
                    <label for="amount_usd" class="form-label">Amount (USD)</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="number" class="form-control" id="amount_usd" name="amount_usd"
                               step="0.01" min="0"
                               value="<?= htmlspecialchars($data['amount_usd'] ?? '0') ?>"
                               placeholder="0.00">
                    </div>
                </div>

                <!-- Amount SSP -->
                <div class="col-md-6 mb-3">
                    <label for="amount_ssp" class="form-label">Amount (SSP)</label>
                    <div class="input-group">
                        <span class="input-group-text">SSP</span>
                        <input type="number" class="form-control" id="amount_ssp" name="amount_ssp"
                               step="0.01" min="0"
                               value="<?= htmlspecialchars($data['amount_ssp'] ?? '0') ?>"
                               placeholder="0.00">
                    </div>
                </div>

                <!-- Cleared By (read-only) -->
                <div class="col-md-6 mb-3">
                    <label class="form-label">Cleared By</label>
                    <input type="text" class="form-control" value="<?= htmlspecialchars($_SESSION['username']) ?>" readonly disabled>
                </div>
            </div>

            <hr>

            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check-circle"></i> <?= $isEdit ? 'Update Record' : 'Save Record' ?>
                </button>
                <a href="index.php?page=dashboard" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Cancel
                </a>
            </div>
        </form>
    </div>
</div>

<?php include __DIR__ . '/../layouts/footer.php'; ?>
