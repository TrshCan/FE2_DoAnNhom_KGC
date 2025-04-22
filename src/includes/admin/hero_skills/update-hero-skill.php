<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
require_once '../../../includes/Database.php';

$data = json_decode(file_get_contents("php://input"));
$db = new Database();
$conn = Database::$connection;

$stmt = $conn->prepare("UPDATE hero_skills SET level = ? WHERE hero_id = ? AND skill_id = ?");
$stmt->bind_param("iii", $data->level, $data->hero_id, $data->skill_id);
$stmt->execute();

echo json_encode(["success" => true]);
