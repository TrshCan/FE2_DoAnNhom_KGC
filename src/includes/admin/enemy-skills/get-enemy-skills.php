<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

$query = "SELECT es.*, e.name AS enemy_name 
          FROM enemy_skills es 
          LEFT JOIN enemies e ON es.enemy_id = e.id 
          ORDER BY es.id DESC";
$result = $conn->query($query);

$enemy_skills = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $enemy_skills[] = $row;
    }
}

echo json_encode($enemy_skills);