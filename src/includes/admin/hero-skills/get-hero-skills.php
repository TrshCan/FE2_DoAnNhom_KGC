<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

$query = "SELECT hs.*, h.name AS hero_name 
          FROM hero_skills hs 
          LEFT JOIN heroes h ON hs.hero_id = h.id 
          ORDER BY hs.id DESC";
$result = $conn->query($query);

$hero_skills = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $hero_skills[] = $row;
    }
}

echo json_encode($hero_skills);