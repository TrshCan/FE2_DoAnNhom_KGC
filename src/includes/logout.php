<?php
// logout.php
// Thiết lập cấu hình cookie phiên
ini_set('session.gc_maxlifetime', 3600);
session_set_cookie_params(3600, '/', 'localhost', false, true);

// Bắt đầu phiên
session_start();

// Thiết lập các tiêu đề CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Xử lý yêu cầu preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Hủy phiên
session_unset();
session_destroy();

// Trả về phản hồi thành công
echo json_encode(['success' => true, 'message' => 'Đăng xuất thành công']);
?>