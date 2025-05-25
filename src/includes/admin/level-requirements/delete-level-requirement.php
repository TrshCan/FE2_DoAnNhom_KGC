<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['level'])) {
    echo json_encode(['error' => 'Thiếu level để xóa']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$level = (int)$data['level'];

$stmt = $conn->prepare("DELETE FROM level_requirements WHERE level = ?");
$stmt->bind_param("i", $level);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>