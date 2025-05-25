<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);
require_once 'Database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

try {
    $db = new Database();
    $conn = $db::$connection;

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $user1 = $_GET['user1'] ?? null;
            $user2 = $_GET['user2'] ?? null;
            if (!$user1 || !$user2 || !is_numeric($user1) || !is_numeric($user2)) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ user1/user2");
            }
            $user1 = (int)$user1;
            $user2 = (int)$user2;

            // Check if users are friends
            $stmt = $conn->prepare("
                SELECT * FROM friends 
                WHERE (user_id = ? AND friend_id = ? OR user_id = ? AND friend_id = ?) 
                AND status = 'accepted'
            ");
            $stmt->bind_param("iiii", $user1, $user2, $user2, $user1);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                http_response_code(403);
                throw new Exception("Chỉ có thể xem tin nhắn với bạn bè đã được chấp nhận");
            }

            $stmt = $conn->prepare("
                SELECT id, sender_id, receiver_id, content, sent_at
                FROM messages
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
                ORDER BY sent_at ASC
            ");
            $stmt->bind_param("iiii", $user1, $user2, $user2, $user1);
            $stmt->execute();
            $result = $stmt->get_result();
            $messages = $result->fetch_all(MYSQLI_ASSOC);
            ob_end_clean();
            echo json_encode($messages);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (
                !isset($data['sender_id']) ||
                !isset($data['receiver_id']) ||
                !isset($data['content']) ||
                !is_numeric($data['sender_id']) ||
                !is_numeric($data['receiver_id']) ||
                empty($data['content'])
            ) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ sender_id/receiver_id/content");
            }
            $sender_id = (int)$data['sender_id'];
            $receiver_id = (int)$data['receiver_id'];
            $content = $data['content'];

            // Check if receiver_id exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->bind_param("i", $receiver_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                http_response_code(400);
                throw new Exception("receiver_id không tồn tại");
            }

            // Check if users are friends
            $stmt = $conn->prepare("
                SELECT * FROM friends 
                WHERE (user_id = ? AND friend_id = ? OR user_id = ? AND friend_id = ?) 
                AND status = 'accepted'
            ");
            $stmt->bind_param("iiii", $sender_id, $receiver_id, $receiver_id, $sender_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                http_response_code(403);
                throw new Exception("Chỉ có thể nhắn tin với bạn bè đã được chấp nhận");
            }

            // Insert message
            $stmt = $conn->prepare("
                INSERT INTO messages (sender_id, receiver_id, content, sent_at) 
                VALUES (?, ?, ?, NOW())
            ");
            $stmt->bind_param("iis", $sender_id, $receiver_id, $content);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                ob_end_clean();
                echo json_encode(["message" => "Gửi tin nhắn thành công"]);
            } else {
                http_response_code(500);
                throw new Exception("Không thể gửi tin nhắn");
            }
            break;

        default:
            http_response_code(405);
            throw new Exception("Phương thức không hỗ trợ");
    }
} catch (Exception $e) {
    ob_end_clean();
    http_response_code($e->getCode() ?: 500);
    echo json_encode(["error" => "Lỗi server: " . $e->getMessage()]);
}
