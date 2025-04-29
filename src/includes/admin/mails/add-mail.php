<?php
header("Access-Control-Allow-Origin: *"); //  cho phép mọi origin gọi API này
// Tốt cho dev/test,
// Nhưng khi lên production, nên đổi thành:
//header("Access-Control-Allow-Origin: http://your-frontend-domain.com");
//để bảo vệ backend khỏi bị gọi từ web lạ.
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['title']) || 
    !isset($data['content']) || 
    !isset($data['sender_email']) || 
    !isset($data['receiver_email'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$title = $conn->real_escape_string($data['title']);
$content = $conn->real_escape_string($data['content']);
$sender_email = $conn->real_escape_string($data['sender_email']);
$receiver_email = $conn->real_escape_string($data['receiver_email']);

$sql = "INSERT INTO mails (title, content, sender_email, receiver_email) 
        VALUES ('$title', '$content', '$sender_email', '$receiver_email')";

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    echo json_encode(['error' => 'Lỗi khi thêm mail: ' . $conn->error]);
}
