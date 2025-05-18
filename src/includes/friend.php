<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);
require_once 'Database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust for production
header('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');
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
            $user_id = $_GET['user_id'] ?? null;
            if (!$user_id || !is_numeric($user_id)) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ user_id");
            }
            $stmt = $conn->prepare("SELECT u.id, u.username AS name FROM users u
                                    JOIN friends f ON f.friend_id = u.id
                                    WHERE f.user_id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $friends = $result->fetch_all(MYSQLI_ASSOC);
            ob_end_clean();
            echo json_encode($friends);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['user_id']) || !isset($data['friend_id']) || !is_numeric($data['user_id']) || !is_numeric($data['friend_id'])) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ user_id/friend_id");
            }
            $user_id = (int)$data['user_id'];
            $friend_id = (int)$data['friend_id'];

            // Check if friend_id exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->bind_param("i", $friend_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                http_response_code(400);
                throw new Exception("friend_id không tồn tại");
            }

            // Check if already friends
            $stmt = $conn->prepare("SELECT * FROM friends WHERE user_id = ? AND friend_id = ?");
            $stmt->bind_param("ii", $user_id, $friend_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                http_response_code(400);
                throw new Exception("Đã là bạn bè");
            }

            // Add friend
            $stmt = $conn->prepare("INSERT INTO friends (user_id, friend_id, created_at) VALUES (?, ?, NOW())");
            $stmt->bind_param("ii", $user_id, $friend_id);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                ob_end_clean();
                echo json_encode(["message" => "Thêm bạn thành công"]);
            } else {
                http_response_code(500);
                throw new Exception("Không thể thêm bạn");
            }
            break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['user_id']) || !isset($data['friend_id']) || !is_numeric($data['user_id']) || !is_numeric($data['friend_id'])) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ user_id/friend_id");
            }
            $user_id = (int)$data['user_id'];
            $friend_id = (int)$data['friend_id'];
            $stmt = $conn->prepare("DELETE FROM friends WHERE user_id = ? AND friend_id = ?");
            $stmt->bind_param("ii", $user_id, $friend_id);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                ob_end_clean();
                echo json_encode(["message" => "Xóa bạn thành công"]);
            } else {
                http_response_code(400);
                throw new Exception("Không tìm thấy quan hệ bạn bè để xóa");
            }
            break;

        default:
            http_response_code(405);
            throw new Exception("Phương thức không hỗ trợ");
    }
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(["error" => "Lỗi server: " . $e->getMessage()]);
}
