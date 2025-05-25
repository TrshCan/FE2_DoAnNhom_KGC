<?php
// get-user-info.php
// Thiết lập cấu hình cookie phiên
ini_set('session.gc_maxlifetime', 3600);
session_set_cookie_params(3600, '/', 'localhost', false, true);

// Bắt đầu phiên
session_start();

// Thiết lập các tiêu đề
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Xử lý yêu cầu preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kiểm tra đăng nhập
$response = ['success' => false, 'message' => 'Not logged in', 'user' => null];

if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
    require_once './Database.php';
    $conn = (new Database())::$connection;
    
    // Truy vấn thông tin người dùng
    $stmt = $conn->prepare("SELECT username, email FROM users WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $response = [
            'success' => true,
            'message' => 'User info retrieved successfully',
            'user' => [
                'username' => $user['username'],
                'email' => $user['email']
            ]
        ];
    } else {
        $response['message'] = 'User not found';
    }
    
    $stmt->close();
    $conn->close();
}

echo json_encode($response);
?>