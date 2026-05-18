<?php
/**
 * Report Controller
 * Handles report generation and print views
 */
class ReportController {
    private $clearanceModel;

    public function __construct(PDO $db) {
        $this->clearanceModel = new Clearance($db);
    }

    /**
     * Show report page with filters
     */
    public function index(): void {
        AuthController::requireLogin();

        $dateFrom    = $_GET['date_from'] ?? null;
        $dateTo      = $_GET['date_to'] ?? null;
        $truckNumber = $_GET['truck_number'] ?? null;

        $records = $this->clearanceModel->getAll($dateFrom, $dateTo, $truckNumber);
        $totals  = $this->clearanceModel->getTotals($dateFrom, $dateTo, $truckNumber);

        include __DIR__ . '/../views/reports/index.php';
    }

    /**
     * Print-friendly report view
     */
    public function printReport(): void {
        AuthController::requireLogin();

        $dateFrom    = $_GET['date_from'] ?? null;
        $dateTo      = $_GET['date_to'] ?? null;
        $truckNumber = $_GET['truck_number'] ?? null;

        $records = $this->clearanceModel->getAll($dateFrom, $dateTo, $truckNumber);
        $totals  = $this->clearanceModel->getTotals($dateFrom, $dateTo, $truckNumber);

        include __DIR__ . '/../views/reports/print.php';
    }
}
