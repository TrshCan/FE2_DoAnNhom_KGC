<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");
require_once '../../admin/BaseURL-upload_image.php';
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['error' => 'Thiếu ID để xóa']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$data['id'];
$targetDir = BASE_URL_upload_image . "/hero-skills/";

// Ensure the target directory exists and is accessible
if (!is_dir($targetDir) || !is_writable($targetDir)) {
    error_log("Directory not accessible or writable: $targetDir");
    echo json_encode(['error' => 'Thư mục ảnh không tồn tại hoặc không có quyền ghi']);
    exit;
}

// Retrieve the icon filename before deleting the record
$sql = "SELECT icon FROM hero_skills WHERE id = $id";
$result = $conn->query($sql);

if (!$result) {
    error_log("Database query failed: " . $conn->error);
    echo json_encode(['error' => 'Lỗi khi truy vấn icon: ' . $conn->error]);
    exit;
}

$icon = null;
if ($row = $result->fetch_assoc()) {
    $icon = $row['icon'];
} else {
    error_log("No hero skill found with ID: $id");
}

if ($icon) {
    $iconPath = $targetDir . $icon;
    error_log("Attempting to delete icon file: $iconPath");
    if (file_exists($iconPath)) {
        if (!unlink($iconPath)) {
            error_log("Failed to delete icon file: $iconPath, Error: " . error_get_last()['message']);
            echo json_encode(['error' => 'Lỗi khi xóa file ảnh từ thư mục']);
            exit;
        } else {
            error_log("Successfully deleted icon file: $iconPath");
        }
    } else {
        error_log("Icon file does not exist: $iconPath");
    }
} else {
    error_log("No icon associated with hero skill ID: $id");
}

// Delete the hero skill record from the database
$sql = "DELETE FROM hero_skills WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Lỗi khi xóa hero skill: ' . $conn->error]);
}

$conn->close();
?>