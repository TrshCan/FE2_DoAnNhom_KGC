<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

$query = "SELECT level, xp_required FROM level_requirements ORDER BY level ASC";
$result = $conn->query($query);

$levelRequirements = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $levelRequirements[] = $row;
    }
}

echo json_encode($levelRequirements);

$conn->close();
?>