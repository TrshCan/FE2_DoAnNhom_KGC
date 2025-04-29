<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['email']) || 
    !isset($data['password']) || 
    !isset($data['username']) || 
    !isset($data['role'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$email = $conn->real_escape_string($data['email']);
$password = password_hash($conn->real_escape_string($data['password']), PASSWORD_BCRYPT);
$username = $conn->real_escape_string($data['username']);
$role = $conn->real_escape_string($data['role']);
$icon = isset($data['icon']) ? $conn->real_escape_string($data['icon']) : null;

$sql = "INSERT INTO users (email, password, username, role, icon) 
        VALUES ('$email', '$password', '$username', '$role', " . ($icon ? "'$icon'" : "NULL") . ")";

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    echo json_encode(['error' => 'Lỗi khi thêm user: ' . $conn->error]);
}