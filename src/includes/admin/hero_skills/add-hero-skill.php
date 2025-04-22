<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
require_once '../../../includes/Database.php';

$data = json_decode(file_get_contents("php://input"));
$db = new Database();
$conn = Database::$connection;

$stmt = $conn->prepare("INSERT INTO hero_skills (hero_id, skill_id, level) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $data->hero_id, $data->skill_id, $data->level);
$stmt->execute();

echo json_encode(["success" => true]);
