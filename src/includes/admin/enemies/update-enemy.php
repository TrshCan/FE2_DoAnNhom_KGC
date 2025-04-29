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
    !isset($data['region_id']) ||
    !isset($data['class_id']) ||
    !isset($data['title']) ||
    !isset($data['description'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$data['id'];
$name = $conn->real_escape_string($data['name']);
$region_id = (int)$data['region_id'];
$class_id = (int)$data['class_id'];
$title = $conn->real_escape_string($data['title']);
$description = $conn->real_escape_string($data['description']);
$icon = isset($data['icon']) ? $conn->real_escape_string($data['icon']) : null;

$sql = "UPDATE enemies 
        SET name = '$name',
            region_id = $region_id,
            class_id = $class_id,
            title = '$title',
            description = '$description',
            icon = " . ($icon ? "'$icon'" : "NULL") . "
        WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Lỗi khi cập nhật enemy: ' . $conn->error]);
}