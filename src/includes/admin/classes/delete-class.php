<?php
header("Access-Control-Allow-Origin: *"); // ⚠️ cho phép mọi origin gọi API này
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

$db = new Database();
$conn = Database::$connection;

$stmt = $conn->prepare("DELETE FROM classes WHERE id = ?");
$stmt->bind_param("i", $data->id);
$stmt->execute();

echo json_encode(["success" => true]);
