<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (
    !isset($_POST['title']) || 
    !isset($_POST['content']) || 
    !isset($_POST['sender_email']) || 
    !isset($_POST['receiver_email'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$title = $conn->real_escape_string($_POST['title']);
$content = $conn->real_escape_string($_POST['content']);
$sender_email = $conn->real_escape_string($_POST['sender_email']);
$receiver_email = $conn->real_escape_string($_POST['receiver_email']);

$stmt = $conn->prepare("INSERT INTO mails (title, content, sender_email, receiver_email) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $title, $content, $sender_email, $receiver_email);
$stmt->execute();

echo json_encode(["success" => true, "id" => $conn->insert_id]);

$conn->close();
?>