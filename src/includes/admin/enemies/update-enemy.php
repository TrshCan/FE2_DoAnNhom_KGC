<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");
require_once '../../admin/BaseURL-upload_image.php';
if (
    !isset($_POST['id']) ||
    !isset($_POST['name']) ||
    !isset($_POST['region_id']) ||
    !isset($_POST['class_id']) ||
    !isset($_POST['title']) ||
    !isset($_POST['description'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$name = $conn->real_escape_string($_POST['name']);
$region_id = (int)$_POST['region_id'];
$class_id = (int)$_POST['class_id'];
$title = $conn->real_escape_string($_POST['title']);
$description = $conn->real_escape_string($_POST['description']);
$icon = null;

$targetDir = BASE_URL_upload_image . "/enemies/";
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Retrieve current icon to retain if no new file is uploaded
$oldIconQuery = "SELECT icon FROM enemies WHERE id = $id";
$result = $conn->query($oldIconQuery);
$oldIcon = null;
if ($result && $row = $result->fetch_assoc()) {
    $oldIcon = $row['icon'];
}

// Handle new icon upload
if (isset($_FILES['icon']) && $_FILES['icon']['error'] === UPLOAD_ERR_OK) {
    $fileName = basename($_FILES['icon']['name']);
    $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $fileSize = $_FILES['icon']['size'];
    $uniqueFileName = uniqid() . '.' . $fileType; // Prevent filename conflicts
    $targetPath = $targetDir . $uniqueFileName;

    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(['error' => 'Định dạng file không hợp lệ. Chỉ hỗ trợ JPG, JPEG, PNG, GIF.']);
        exit;
    }

    if ($fileSize > $maxFileSize) {
        echo json_encode(['error' => 'Kích thước file vượt quá 5MB.']);
        exit;
    }

    // Delete old icon if it exists
    if ($oldIcon) {
        $oldIconPath = $targetDir . $oldIcon;
        if (file_exists($oldIconPath)) {
            if (!unlink($oldIconPath)) {
                echo json_encode(['error' => 'Lỗi khi xóa file ảnh cũ']);
                exit;
            }
        }
    }

    if (move_uploaded_file($_FILES['icon']['tmp_name'], $targetPath)) {
        $icon = $uniqueFileName;
    } else {
        echo json_encode(['error' => 'Lỗi khi tải file lên server.']);
        exit;
    }
} else {
    // No new file uploaded, retain old icon
    $icon = $oldIcon;
}

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

$conn->close();
?>