<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (!isset($_POST['user_id']) || !isset($_POST['item_id']) || !isset($_POST['quantity'])) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$user_id = (int)$_POST['user_id'];
$item_id = (int)$_POST['item_id'];
$quantity = (int)$_POST['quantity'];

$stmt = $conn->prepare("INSERT INTO inventory (user_id, item_id, quantity) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $user_id, $item_id, $quantity);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>