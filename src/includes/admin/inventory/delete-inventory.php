<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id']) || !isset($data['item_id'])) {
    echo json_encode(['error' => 'Thiếu user_id hoặc item_id để xóa']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$user_id = (int)$data['user_id'];
$item_id = (int)$data['item_id'];

$stmt = $conn->prepare("DELETE FROM inventory WHERE user_id = ? AND item_id = ?");
$stmt->bind_param("ii", $user_id, $item_id);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>