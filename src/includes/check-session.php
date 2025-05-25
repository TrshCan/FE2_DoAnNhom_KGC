<?php
// check-session.php
session_start();
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Initialize response
$response = ['success' => true, 'loggedIn' => false, 'role' => null];

// Check login status
if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
    require_once './Database.php';
    $conn = (new Database())::$connection;
    
    // Query to fetch user role
    $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $response = [
            'success' => true,
            'loggedIn' => true,
            'role' => $user['role']
        ];
    } else {
        // If user_id is invalid, treat as not logged in
        $response = [
            'success' => true,
            'loggedIn' => false,
            'role' => null
        ];
    }
    
    $stmt->close();
    $conn->close();
}

echo json_encode($response);
?>