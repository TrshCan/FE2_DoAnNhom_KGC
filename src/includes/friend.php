<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);
require_once 'Database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS');
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
            $type = $_GET['type'] ?? 'friends';
            if (!$user_id || !is_numeric($user_id)) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ user_id");
            }
            $user_id = (int)$user_id;

            if ($type === 'friends') {
                $stmt = $conn->prepare("
                    SELECT u.id, u.username AS name
                    FROM users u
                    JOIN friends f ON f.friend_id = u.id
                    WHERE f.user_id = ? AND f.status = 'accepted'
                    UNION
                    SELECT u.id, u.username AS name
                    FROM users u
                    JOIN friends f ON f.user_id = u.id
                    WHERE f.friend_id = ? AND f.status = 'accepted'
                ");
                $stmt->bind_param("ii", $user_id, $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $friends = $result->fetch_all(MYSQLI_ASSOC);
                ob_end_clean();
                echo json_encode($friends);
            } elseif ($type === 'sent_requests') {
                $stmt = $conn->prepare("
                    SELECT u.id, u.username AS name
                    FROM users u
                    JOIN friends f ON f.friend_id = u.id
                    WHERE f.user_id = ? AND f.status = 'pending'
                ");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $sent_requests = $result->fetch_all(MYSQLI_ASSOC);
                ob_end_clean();
                echo json_encode($sent_requests);
            } elseif ($type === 'received_requests') {
                $stmt = $conn->prepare("
                    SELECT u.id, u.username AS name
                    FROM users u
                    JOIN friends f ON f.user_id = u.id
                    WHERE f.friend_id = ? AND f.status = 'pending'
                ");
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $received_requests = $result->fetch_all(MYSQLI_ASSOC);
                ob_end_clean();
                echo json_encode($received_requests);
            } else {
                http_response_code(400);
                throw new Exception("Loại yêu cầu không hợp lệ");
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['user_id']) || !isset($data['friend_id']) || !is_numeric($data['user_id']) || !is_numeric($data['friend_id'])) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ user_id/friend_id");
            }
            $user_id = (int)$data['user_id'];
            $friend_id = (int)$data['friend_id'];

            if ($user_id === $friend_id) {
                http_response_code(400);
                throw new Exception("Không thể gửi lời mời kết bạn cho chính mình");
            }

            $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->bind_param("i", $friend_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                http_response_code(400);
                throw new Exception("friend_id không tồn tại");
            }

            $stmt = $conn->prepare("
                SELECT status FROM friends 
                WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
            ");
            $stmt->bind_param("iiii", $user_id, $friend_id, $friend_id, $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $existing = $result->fetch_assoc();
                if ($existing['status'] === 'accepted') {
                    http_response_code(400);
                    throw new Exception("Đã là bạn bè");
                } else {
                    http_response_code(400);
                    throw new Exception("Lời mời kết bạn đã tồn tại");
                }
            }

            $stmt = $conn->prepare("
                INSERT INTO friends (user_id, friend_id, status, created_at) 
                VALUES (?, ?, 'pending', NOW())
            ");
            $stmt->bind_param("ii", $user_id, $friend_id);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                ob_end_clean();
                echo json_encode(["message" => "Gửi lời mời kết bạn thành công"]);
            } else {
                http_response_code(500);
                throw new Exception("Không thể gửi lời mời kết bạn");
            }
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!isset($data['user_id']) || !isset($data['friend_id']) || !is_numeric($data['user_id']) || !is_numeric($data['friend_id']) || !isset($data['action'])) {
                http_response_code(400);
                throw new Exception("Thiếu hoặc không hợp lệ user_id/friend_id/action");
            }
            $user_id = (int)$data['user_id'];
            $friend_id = (int)$data['friend_id'];
            $action = $data['action'];

            $stmt = $conn->prepare("
                SELECT id, status FROM friends 
                WHERE user_id = ? AND friend_id = ? AND status = 'pending'
            ");
            $stmt->bind_param("ii", $friend_id, $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows === 0) {
                http_response_code(400);
                throw new Exception("Không tìm thấy lời mời kết bạn hoặc lời mời đã được xử lý");
            }

            if ($action === 'accept') {
                $stmt = $conn->prepare("
                    UPDATE friends 
                    SET status = 'accepted' 
                    WHERE user_id = ? AND friend_id = ?
                ");
                $stmt->bind_param("ii", $friend_id, $user_id);
                $stmt->execute();
                if ($stmt->affected_rows > 0) {
                    $stmt = $conn->prepare("
                        INSERT INTO friends (user_id, friend_id, status, created_at) 
                        VALUES (?, ?, 'accepted', NOW())
                    ");
                    $stmt->bind_param("ii", $user_id, $friend_id);
                    $stmt->execute();
                    ob_end_clean();
                    echo json_encode(["message" => "Chấp nhận lời mời kết bạn thành công"]);
                } else {
                    http_response_code(500);
                    throw new Exception("Không thể chấp nhận lời mời kết bạn");
                }
            } elseif ($action === 'reject') {
                $stmt = $conn->prepare("
                    DELETE FROM friends 
                    WHERE user_id = ? AND friend_id = ? AND status = 'pending'
                ");
                $stmt->bind_param("ii", $friend_id, $user_id);
                $stmt->execute();
                if ($stmt->affected_rows > 0) {
                    ob_end_clean();
                    echo json_encode(["message" => "Từ chối lời mời kết bạn thành công"]);
                } else {
                    http_response_code(500);
                    throw new Exception("Không thể từ chối lời mời kết bạn");
                }
            } else {
                http_response_code(400);
                throw new Exception("Hành động không hợp lệ");
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
            $stmt = $conn->prepare("
                DELETE FROM friends 
                WHERE (user_id = ? AND friend_id = ? AND status = 'accepted') 
                   OR (user_id = ? AND friend_id = ? AND status = 'accepted')
            ");
            $stmt->bind_param("iiii", $user_id, $friend_id, $friend_id, $user_id);
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
    http_response_code($e->getCode() ?: 500);
    echo json_encode(["error" => "Lỗi server: " . $e->getMessage()]);
}