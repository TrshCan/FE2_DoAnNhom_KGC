<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

// Join with users and sundries to get names
$query = "SELECT i.user_id, i.item_id, i.quantity, u.username AS user_name, s.name AS item_name 
          FROM inventory i 
          JOIN users u ON i.user_id = u.id 
          JOIN sundries s ON i.item_id = s.id 
          ORDER BY i.user_id, i.item_id";
$result = $conn->query($query);

$inventory = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $inventory[] = $row;
    }
} else {
    // Log error for debugging
    error_log("Query failed or no results: " . $conn->error);
}

echo json_encode($inventory);

$conn->close();
?>