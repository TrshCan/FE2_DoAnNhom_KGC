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
    !isset($_POST['title'])
) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$name = $conn->real_escape_string($_POST['name']);
$region_id = isset($_POST['region_id']) && $_POST['region_id'] !== '' ? (int)$_POST['region_id'] : null;
$class_id = isset($_POST['class_id']) && $_POST['class_id'] !== '' ? (int)$_POST['class_id'] : null;
$title = $conn->real_escape_string($_POST['title']);
$description = $conn->real_escape_string($_POST['description'] ?? '');
$icon = null;

$targetDir = BASE_URL_upload_image . "/heroes/";
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Retrieve current icon to retain if no new file is uploaded
$oldIconQuery = "SELECT icon FROM heroes WHERE id = $id";
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
                error_log("Failed to delete old icon file: $oldIconPath");
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

$stmt = $conn->prepare("UPDATE heroes SET name = ?, region_id = ?, class_id = ?, title = ?, description = ?, icon = ? WHERE id = ?");
$stmt->bind_param("siisssi", $name, $region_id, $class_id, $title, $description, $icon, $id);
$stmt->execute();

echo json_encode(["status" => "updated"]);

$conn->close();
?>