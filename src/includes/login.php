<?php
// Set CORS headers
ini_set('session.gc_maxlifetime', 3600);
session_set_cookie_params(3600, '/', 'localhost', false, true);
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once './Database.php';

session_start();

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required', 'user_id' => false]);
    exit;
}

$conn = (new Database())::$connection;

// Check if user exists
$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$response = ['success' => false, 'message' => 'Invalid credentials', 'user_id' => false];

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $response = ['success' => true, 'message' => 'Login successful', 'user_id' => $user['id']];
    }
}

echo json_encode($response);
