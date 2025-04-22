<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../../../includes/Database.php';

$db = new Database();
$conn = Database::$connection;

$result = $conn->query("SELECT * FROM hero_skills");
$skills = [];

while ($row = $result->fetch_assoc()) {
    $skills[] = $row;
}

echo json_encode($skills);
