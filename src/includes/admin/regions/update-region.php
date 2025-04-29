<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['id']) ||
    !isset($data['name']) ||
    !isset($data['description'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$data['id'];
$name = $conn->real_escape_string($data['name']);
$description = $conn->real_escape_string($data['description']);
$icon = isset($data['icon']) ? $conn->real_escape_string($data['icon']) : null;

$sql = "UPDATE regions 
        SET name = '$name',
            description = '$description',
            icon = " . ($icon ? "'$icon'" : "NULL") . "
        WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Lỗi khi cập nhật region: ' . $conn->error]);
}