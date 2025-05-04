<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");
require_once '../../admin/BaseURL-upload_image.php';

if (
    !isset($_POST['id']) ||
    !isset($_POST['email']) ||
    !isset($_POST['username']) ||
    !isset($_POST['role'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$email = $conn->real_escape_string($_POST['email']);
$username = $conn->real_escape_string($_POST['username']);
$role = $conn->real_escape_string($_POST['role']);
$icon = null;

$targetDir = BASE_URL_upload_image . "/users/";
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

// Retrieve current icon to retain if no new file is uploaded
$oldIconQuery = "SELECT icon FROM users WHERE id = ?";
$stmt = $conn->prepare($oldIconQuery);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
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

// Prepare password update if provided
$password = null;
if (!empty($_POST['password'])) {
    $password = password_hash($conn->real_escape_string($_POST['password']), PASSWORD_BCRYPT);
}

if ($password) {
    $stmt = $conn->prepare("UPDATE users SET email = ?, password = ?, username = ?, role = ?, icon = ? WHERE id = ?");
    $stmt->bind_param("sssssi", $email, $password, $username, $role, $icon, $id);
} else {
    $stmt = $conn->prepare("UPDATE users SET email = ?, username = ?, role = ?, icon = ? WHERE id = ?");
    $stmt->bind_param("ssssi", $email, $username, $role, $icon, $id);
}
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>