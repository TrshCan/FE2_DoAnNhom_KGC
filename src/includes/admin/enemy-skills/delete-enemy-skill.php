<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");
require_once '../../admin/BaseURL-upload_image.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['error' => 'Thiếu ID để xóa']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$data['id'];
$targetDir = BASE_URL_upload_image . "/enemy-skills/";

// Retrieve the icon filename before deleting the record
$stmt = $conn->prepare("SELECT icon FROM enemy_skills WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$icon = null;
if ($row = $result->fetch_assoc()) {
    $icon = $row['icon'];
}

// Delete the icon file if it exists
if ($icon) {
    $iconPath = $targetDir . $icon;
    if (file_exists($iconPath)) {
        if (!unlink($iconPath)) {
            error_log("Failed to delete icon file: $iconPath");
            echo json_encode(['error' => 'Lỗi khi xóa file ảnh']);
            exit;
        }
    }
}

// Delete the skill record
$stmt = $conn->prepare("DELETE FROM enemy_skills WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>