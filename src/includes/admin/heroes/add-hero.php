<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");
require_once '../../admin/BaseURL-upload_image.php';

if (
    !isset($_POST['name']) || 
    !isset($_POST['title'])
) {
    echo json_encode(['status' => 'error', 'message' => 'Name and Title are required']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$name = $conn->real_escape_string($_POST['name']);
$region_id = isset($_POST['region_id']) && $_POST['region_id'] !== '' ? (int)$_POST['region_id'] : null;
$class_id = isset($_POST['class_id']) && $_POST['class_id'] !== '' ? (int)$_POST['class_id'] : null;
$title = $conn->real_escape_string($_POST['title']);
$description = $conn->real_escape_string($_POST['description'] ?? '');
$icon = null;

$targetDir = BASE_URL_upload_image . "/heroes/";
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

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

    if (move_uploaded_file($_FILES['icon']['tmp_name'], $targetPath)) {
        $icon = $uniqueFileName;
    } else {
        echo json_encode(['error' => 'Lỗi khi tải file lên server.']);
        exit;
    }
}

$stmt = $conn->prepare("INSERT INTO heroes (name, region_id, class_id, title, description, icon) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("siisss", $name, $region_id, $class_id, $title, $description, $icon);
$stmt->execute();

echo json_encode(["status" => "success"]);

$conn->close();
?>