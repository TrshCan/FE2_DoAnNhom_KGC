<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['id']) ||
    !isset($data['email']) ||
    !isset($data['username']) ||
    !isset($data['role'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$data['id'];
$email = $conn->real_escape_string($data['email']);
$username = $conn->real_escape_string($data['username']);
$role = $conn->real_escape_string($data['role']);
$icon = isset($data['icon']) ? $conn->real_escape_string($data['icon']) : null;

// Check if password is provided for update
$password_sql = "";
if (!empty($data['password'])) {
    $password = password_hash($conn->real_escape_string($data['password']), PASSWORD_BCRYPT);
    $password_sql = ", password = '$password'";
}

$sql = "UPDATE users 
        SET email = '$email',
            username = '$username',
            role = '$role',
            icon = " . ($icon ? "'$icon'" : "NULL") . "
            $password_sql
        WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Lỗi khi cập nhật user: ' . $conn->error]);
}