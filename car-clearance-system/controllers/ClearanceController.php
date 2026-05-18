<?php
/**
 * Clearance Controller
 * Handles CRUD operations for car clearance records
 */
class ClearanceController {
    private $clearanceModel;

    public function __construct(PDO $db) {
        $this->clearanceModel = new Clearance($db);
    }

    /**
     * List all clearances (Dashboard)
     */
    public function index(): void {
        AuthController::requireLogin();

        // Get filter parameters
        $dateFrom    = $_GET['date_from'] ?? null;
        $dateTo      = $_GET['date_to'] ?? null;
        $truckNumber = $_GET['truck_number'] ?? null;
        $search      = $_GET['search'] ?? null;

        $records = $this->clearanceModel->getAll($dateFrom, $dateTo, $truckNumber, $search);
        $totals  = $this->clearanceModel->getTotals($dateFrom, $dateTo, $truckNumber);

        include __DIR__ . '/../views/dashboard/index.php';
    }

    /**
     * Show new clearance form
     */
    public function create(): void {
        AuthController::requireLogin();
        $record = null;
        include __DIR__ . '/../views/clearances/form.php';
    }

    /**
     * Store a new clearance record
     */
    public function store(): void {
        AuthController::requireLogin();

        $errors = $this->validateInput($_POST);
        if (!empty($errors)) {
            $_SESSION['error'] = implode('<br>', $errors);
            $_SESSION['old_input'] = $_POST;
            header('Location: index.php?page=clearances&action=create');
            exit;
        }

        $data = $this->sanitizeInput($_POST);
        $data['cleared_by_username'] = $_SESSION['username'];

        if ($this->clearanceModel->create($data)) {
            $_SESSION['success'] = 'Clearance record created successfully.';
            header('Location: index.php?page=dashboard');
        } else {
            $_SESSION['error'] = 'Failed to create clearance record.';
            header('Location: index.php?page=clearances&action=create');
        }
        exit;
    }

    /**
     * Show edit form (admin only)
     */
    public function edit(int $id): void {
        AuthController::requireAdmin();

        $record = $this->clearanceModel->findById($id);
        if (!$record) {
            $_SESSION['error'] = 'Record not found.';
            header('Location: index.php?page=dashboard');
            exit;
        }

        include __DIR__ . '/../views/clearances/form.php';
    }

    /**
     * Update a clearance record (admin only)
     */
    public function update(int $id): void {
        AuthController::requireAdmin();

        $errors = $this->validateInput($_POST);
        if (!empty($errors)) {
            $_SESSION['error'] = implode('<br>', $errors);
            $_SESSION['old_input'] = $_POST;
            header("Location: index.php?page=clearances&action=edit&id=$id");
            exit;
        }

        $data = $this->sanitizeInput($_POST);

        if ($this->clearanceModel->update($id, $data)) {
            $_SESSION['success'] = 'Clearance record updated successfully.';
            header('Location: index.php?page=dashboard');
        } else {
            $_SESSION['error'] = 'Failed to update clearance record.';
            header("Location: index.php?page=clearances&action=edit&id=$id");
        }
        exit;
    }

    /**
     * Delete a clearance record (admin only)
     */
    public function delete(int $id): void {
        AuthController::requireAdmin();

        if ($this->clearanceModel->delete($id)) {
            $_SESSION['success'] = 'Record deleted successfully.';
        } else {
            $_SESSION['error'] = 'Failed to delete record.';
        }
        header('Location: index.php?page=dashboard');
        exit;
    }

    /**
     * Validate form input
     */
    private function validateInput(array $data): array {
        $errors = [];

        if (empty($data['clearance_date'])) {
            $errors[] = 'Date is required.';
        }
        if (empty(trim($data['truck_number'] ?? ''))) {
            $errors[] = 'Truck Number is required.';
        }
        if (empty(trim($data['consignment'] ?? ''))) {
            $errors[] = 'Consignment is required.';
        }
        if (empty($data['truck_type']) || !in_array($data['truck_type'], ['Fuso', 'Trailer', 'Canter', 'Tipper', 'Pickup', 'Other'])) {
            $errors[] = 'Valid Truck Type is required.';
        }
        if (empty($data['paid_in_currency']) || !in_array($data['paid_in_currency'], ['USD', 'SSP'])) {
            $errors[] = 'Payment currency must be specified.';
        }

        // Validate currency logic
        if (!empty($data['paid_in_currency'])) {
            if ($data['paid_in_currency'] === 'USD') {
                if (empty($data['amount_usd']) || floatval($data['amount_usd']) <= 0) {
                    $errors[] = 'USD amount must be greater than 0 when paying in USD.';
                }
            } elseif ($data['paid_in_currency'] === 'SSP') {
                if (empty($data['amount_ssp']) || floatval($data['amount_ssp']) <= 0) {
                    $errors[] = 'SSP amount must be greater than 0 when paying in SSP.';
                }
            }
        }

        return $errors;
    }

    /**
     * Sanitize form input
     */
    private function sanitizeInput(array $data): array {
        $paidIn = $data['paid_in_currency'];

        return [
            'clearance_date'   => $data['clearance_date'],
            'truck_number'     => trim($data['truck_number']),
            'consignment'      => trim($data['consignment']),
            'items'            => trim($data['items'] ?? ''),
            'truck_type'       => $data['truck_type'],
            'amount_usd'       => $paidIn === 'USD' ? floatval($data['amount_usd']) : 0.00,
            'amount_ssp'       => $paidIn === 'SSP' ? floatval($data['amount_ssp']) : 0.00,
            'paid_in_currency' => $paidIn,
        ];
    }
}
