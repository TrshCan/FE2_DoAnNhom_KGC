<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

$query = "SELECT e.*, r.name AS region_name, c.name AS class_name 
          FROM enemies e 
          LEFT JOIN regions r ON e.region_id = r.id 
          LEFT JOIN classes c ON e.class_id = c.id 
          ORDER BY e.id DESC";
$result = $conn->query($query);

$enemies = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $enemies[] = $row;
    }
}

echo json_encode($enemies);