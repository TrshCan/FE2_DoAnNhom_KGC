<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

$stmt = $conn->prepare("SELECT id, name FROM enemies");
$stmt->execute();
$result = $stmt->get_result();

$enemies = [];
while ($row = $result->fetch_assoc()) {
    $enemies[] = $row;
}

echo json_encode($enemies);

$conn->close();
?>