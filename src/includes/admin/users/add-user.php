<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");
require_once '../../admin/BaseURL-upload_image.php';

if (
    !isset($_POST['email']) || 
    !isset($_POST['password']) || 
    !isset($_POST['username']) || 
    !isset($_POST['role'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$email = $conn->real_escape_string($_POST['email']);
$password = password_hash($conn->real_escape_string($_POST['password']), PASSWORD_BCRYPT);
$username = $conn->real_escape_string($_POST['username']);
$role = $conn->real_escape_string($_POST['role']);
$icon = null;

$targetDir = BASE_URL_upload_image . "/users/";
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

$stmt = $conn->prepare("INSERT INTO users (email, password, username, role, icon) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $email, $password, $username, $role, $icon);
$stmt->execute();

echo json_encode(["success" => true, "id" => $conn->insert_id]);

$conn->close();
?>