<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

$query = "SELECT id, name FROM sundries ORDER BY name ASC";
$result = $conn->query($query);

$sundries = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $sundries[] = $row;
    }
}

echo json_encode($sundries);

$conn->close();
?>