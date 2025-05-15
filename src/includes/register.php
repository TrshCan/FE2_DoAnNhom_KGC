<?php
// Set CORS headers
header("Access-Control-Allow-Origin: *"); // Restrict to your frontend origin
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
session_start();
header('Content-Type: application/json');
require_once './Database.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username']);
$email = trim($data['email']);
$password = trim($data['password']);

$conn = (new Database())::$connection;

$response = ['success' => false, 'message' => 'Something went wrong'];

// Check if email already exists
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    $response['message'] = 'Email already in use';
} else {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);

    if ($stmt->execute()) {
        $_SESSION['user_id'] = $stmt->insert_id;
        $response = ['success' => true, 'message' => 'Registration successful'];
    }
}

echo json_encode($response);
