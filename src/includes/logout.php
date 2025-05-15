<?php
// Thêm header cho phép CORS
header("Access-Control-Allow-Origin: *");  // Cho phép tất cả nguồn gốc
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  // Các phương thức được phép
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Các header được phép
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; 
}

// Tiến hành xử lý đăng xuất
session_start();
session_unset();
session_destroy();
echo json_encode(['success' => true]);


?>

