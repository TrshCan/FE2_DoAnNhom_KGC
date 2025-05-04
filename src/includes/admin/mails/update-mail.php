<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (
    !isset($_POST['id']) ||
    !isset($_POST['title']) ||
    !isset($_POST['content']) ||
    !isset($_POST['sender_email']) ||
    !isset($_POST['receiver_email'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$title = $conn->real_escape_string($_POST['title']);
$content = $conn->real_escape_string($_POST['content']);
$sender_email = $conn->real_escape_string($_POST['sender_email']);
$receiver_email = $conn->real_escape_string($_POST['receiver_email']);

$stmt = $conn->prepare("UPDATE mails SET title = ?, content = ?, sender_email = ?, receiver_email = ? WHERE id = ?");
$stmt->bind_param("ssssi", $title, $content, $sender_email, $receiver_email, $id);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>