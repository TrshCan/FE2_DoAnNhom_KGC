<?php
// check-session.php
session_start();
header("Content-Type: application/json");

// Handle preflight request (optional, may not even be needed through proxy)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check login status
$loggedIn = isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);

echo json_encode(['success' => true, 'loggedIn' => $loggedIn, 'user_id' => $_SESSION['user_id'] ? $_SESSION['user_id'] : 1]);
