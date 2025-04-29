<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['error' => 'Thiếu ID để xoá']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$data['id'];
$sql = "DELETE FROM regions WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Lỗi khi xoá region: ' . $conn->error]);
}