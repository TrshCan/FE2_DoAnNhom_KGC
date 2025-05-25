<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (!isset($_POST['id']) || !isset($_POST['type']) || !isset($_POST['value'])) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$type = $_POST['type'];
$value = (int)$_POST['value'];

$stmt = $conn->prepare("UPDATE xp_amounts SET type = ?, value = ? WHERE id = ?");
$stmt->bind_param("sii", $type, $value, $id);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>