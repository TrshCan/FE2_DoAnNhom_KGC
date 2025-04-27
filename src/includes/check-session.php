<?php
// check-session.php
session_start();

// Thiết lập các header CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Cần thiết cho credentials: 'include'
header("Content-Type: application/json");

// Xử lý yêu cầu preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kiểm tra trạng thái đăng nhập
$loggedIn = isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);

echo json_encode(['success' => true, 'loggedIn' => $loggedIn]);
exit();