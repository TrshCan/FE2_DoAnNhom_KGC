<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['enemy_id']) || 
    !isset($data['name']) || 
    !isset($data['description']) || 
    !isset($data['type'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$enemy_id = (int)$data['enemy_id'];
$name = $conn->real_escape_string($data['name']);
$description = $conn->real_escape_string($data['description']);
$type = $conn->real_escape_string($data['type']);

$sql = "INSERT INTO enemy_skills (enemy_id, name, description, type) 
        VALUES ($enemy_id, '$name', '$description', '$type')";

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    echo json_encode(['error' => 'Lỗi khi thêm enemy skill: ' . $conn->error]);
}