<?php
session_start();
header('Content-Type: application/json');

require_once 'Database.php';
$db = new Database();  // <== ADD THIS LINE
$conn = Database::$connection; // <== ADD THIS LINE

// Get user_id from GET or session
$user_id = $_SESSION['user_id'] ?? $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'username' => $row['username']]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
