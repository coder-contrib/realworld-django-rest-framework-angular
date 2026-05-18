<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Print Report - Car Clearance Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            padding: 20px;
        }
        .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #333;
        }
        .print-header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        .print-header p {
            margin: 2px 0;
            color: #555;
        }
        .filters-applied {
            margin-bottom: 20px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            font-size: 0.85rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: left;
        }
        th {
            background: #2c3e50;
            color: #fff;
            font-weight: 600;
        }
        tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        .totals-row {
            background: #2c3e50 !important;
            color: #fff;
            font-weight: 700;
        }
        .print-footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #333;
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            color: #666;
        }
        .summary-cards {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .summary-card {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: center;
        }
        .summary-card .value {
            font-size: 1.2rem;
            font-weight: 700;
            color: #2c3e50;
        }
        .summary-card .label {
            font-size: 0.75rem;
            color: #666;
        }
        .no-print { display: none; }

        @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
        }

        @media screen {
            .print-actions {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1000;
            }
        }
    </style>
</head>
<body>
    <!-- Print Button (visible only on screen) -->
    <div class="print-actions no-print" style="display: block;">
        <button onclick="window.print()" class="btn btn-primary btn-sm">
            <i class="bi bi-printer"></i> Print
        </button>
        <button onclick="window.close()" class="btn btn-secondary btn-sm">
            Close
        </button>
    </div>

    <!-- Company Header -->
    <div class="print-header">
        <h1>Car Clearance Management System</h1>
        <p><strong>Clearance Report</strong></p>
        <p>Generated on: <?= date('F j, Y \a\t g:i A') ?></p>
    </div>

    <!-- Filters Applied -->
    <?php if ($dateFrom || $dateTo || $truckNumber): ?>
    <div class="filters-applied">
        <strong>Filters Applied:</strong>
        <?php if ($dateFrom): ?> From: <?= htmlspecialchars($dateFrom) ?> <?php endif; ?>
        <?php if ($dateTo): ?> To: <?= htmlspecialchars($dateTo) ?> <?php endif; ?>
        <?php if ($truckNumber): ?> | Truck: <?= htmlspecialchars($truckNumber) ?> <?php endif; ?>
    </div>
    <?php endif; ?>

    <!-- Summary -->
    <div class="summary-cards">
        <div class="summary-card">
            <div class="value"><?= $totals['total_records'] ?? 0 ?></div>
            <div class="label">Total Records</div>
        </div>
        <div class="summary-card">
            <div class="value">$<?= number_format($totals['total_usd'] ?? 0, 2) ?></div>
            <div class="label">Total USD</div>
        </div>
        <div class="summary-card">
            <div class="value"><?= number_format($totals['total_ssp'] ?? 0, 2) ?> SSP</div>
            <div class="label">Total SSP</div>
        </div>
    </div>

    <!-- Report Table -->
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Truck Number</th>
                <th>Consignment</th>
                <th>Items</th>
                <th>Truck Type</th>
                <th>Amount USD</th>
                <th>Amount SSP</th>
                <th>Cleared By</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($records)): ?>
            <tr>
                <td colspan="9" style="text-align: center;">No records found.</td>
            </tr>
            <?php else: ?>
            <?php foreach ($records as $i => $r): ?>
            <tr>
                <td><?= $i + 1 ?></td>
                <td><?= htmlspecialchars($r['clearance_date']) ?></td>
                <td><?= htmlspecialchars($r['truck_number']) ?></td>
                <td><?= htmlspecialchars($r['consignment']) ?></td>
                <td><?= htmlspecialchars($r['items']) ?></td>
                <td><?= htmlspecialchars($r['truck_type']) ?></td>
                <td><?= $r['amount_usd'] > 0 ? '$' . number_format($r['amount_usd'], 2) : '-' ?></td>
                <td><?= $r['amount_ssp'] > 0 ? number_format($r['amount_ssp'], 2) : '-' ?></td>
                <td><?= htmlspecialchars($r['cleared_by_username']) ?></td>
            </tr>
            <?php endforeach; ?>
            <tr class="totals-row">
                <td colspan="6" style="text-align: right;">TOTALS:</td>
                <td>$<?= number_format($totals['total_usd'], 2) ?></td>
                <td><?= number_format($totals['total_ssp'], 2) ?> SSP</td>
                <td></td>
            </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <!-- Footer -->
    <div class="print-footer">
        <span>Car Clearance Management System</span>
        <span>Date Printed: <?= date('Y-m-d H:i:s') ?></span>
        <span>Total Records: <?= $totals['total_records'] ?? 0 ?></span>
    </div>

    <script>
        // Auto-trigger print dialog
        window.onload = function() {
            // Small delay to ensure everything is rendered
            setTimeout(function() {
                // Don't auto-print; let user click the button
            }, 500);
        };
    </script>
</body>
</html>
