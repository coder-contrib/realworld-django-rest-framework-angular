<?php
/**
 * Clearance Model
 * Handles all database operations for car clearance records
 */
class Clearance {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get all clearances with optional filters
     */
    public function getAll(?string $dateFrom = null, ?string $dateTo = null, ?string $truckNumber = null, ?string $search = null): array {
        $sql = "SELECT * FROM car_clearances WHERE 1=1";
        $params = [];

        if ($dateFrom) {
            $sql .= " AND clearance_date >= :date_from";
            $params['date_from'] = $dateFrom;
        }
        if ($dateTo) {
            $sql .= " AND clearance_date <= :date_to";
            $params['date_to'] = $dateTo;
        }
        if ($truckNumber) {
            $sql .= " AND truck_number LIKE :truck_number";
            $params['truck_number'] = "%$truckNumber%";
        }
        if ($search) {
            $sql .= " AND (truck_number LIKE :search OR consignment LIKE :search2 OR items LIKE :search3)";
            $params['search'] = "%$search%";
            $params['search2'] = "%$search%";
            $params['search3'] = "%$search%";
        }

        $sql .= " ORDER BY clearance_date DESC, created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Find clearance by ID
     */
    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM car_clearances WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $record = $stmt->fetch();
        return $record ?: null;
    }

    /**
     * Create a new clearance record
     */
    public function create(array $data): bool {
        $stmt = $this->db->prepare(
            "INSERT INTO car_clearances
            (clearance_date, truck_number, consignment, items, truck_type, amount_usd, amount_ssp, paid_in_currency, cleared_by_username)
            VALUES
            (:clearance_date, :truck_number, :consignment, :items, :truck_type, :amount_usd, :amount_ssp, :paid_in_currency, :cleared_by_username)"
        );
        return $stmt->execute([
            'clearance_date'     => $data['clearance_date'],
            'truck_number'       => $data['truck_number'],
            'consignment'        => $data['consignment'],
            'items'              => $data['items'] ?? '',
            'truck_type'         => $data['truck_type'],
            'amount_usd'         => $data['amount_usd'],
            'amount_ssp'         => $data['amount_ssp'],
            'paid_in_currency'   => $data['paid_in_currency'],
            'cleared_by_username'=> $data['cleared_by_username'],
        ]);
    }

    /**
     * Update an existing clearance record
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare(
            "UPDATE car_clearances SET
            clearance_date = :clearance_date,
            truck_number = :truck_number,
            consignment = :consignment,
            items = :items,
            truck_type = :truck_type,
            amount_usd = :amount_usd,
            amount_ssp = :amount_ssp,
            paid_in_currency = :paid_in_currency
            WHERE id = :id"
        );
        return $stmt->execute([
            'clearance_date'   => $data['clearance_date'],
            'truck_number'     => $data['truck_number'],
            'consignment'      => $data['consignment'],
            'items'            => $data['items'] ?? '',
            'truck_type'       => $data['truck_type'],
            'amount_usd'       => $data['amount_usd'],
            'amount_ssp'       => $data['amount_ssp'],
            'paid_in_currency' => $data['paid_in_currency'],
            'id'               => $id,
        ]);
    }

    /**
     * Delete a clearance record
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM car_clearances WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    /**
     * Get totals for filtered records
     */
    public function getTotals(?string $dateFrom = null, ?string $dateTo = null, ?string $truckNumber = null): array {
        $sql = "SELECT COALESCE(SUM(amount_usd), 0) as total_usd, COALESCE(SUM(amount_ssp), 0) as total_ssp, COUNT(*) as total_records FROM car_clearances WHERE 1=1";
        $params = [];

        if ($dateFrom) {
            $sql .= " AND clearance_date >= :date_from";
            $params['date_from'] = $dateFrom;
        }
        if ($dateTo) {
            $sql .= " AND clearance_date <= :date_to";
            $params['date_to'] = $dateTo;
        }
        if ($truckNumber) {
            $sql .= " AND truck_number LIKE :truck_number";
            $params['truck_number'] = "%$truckNumber%";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    }
}
