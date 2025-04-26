<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type");
session_start();
header('Content-Type: application/json');

require_once './Database.php';
$db = new Database();
$conn = Database::$connection;

$user_id = $_SESSION['user_id'] ?? $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Fetch team or Update team
$action = $_GET['action'] ?? '';

try {
    if ($action === 'fetch') {
        $stmt = $conn->prepare("SELECT * FROM teams WHERE user_id = ?");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $team = $result->fetch_assoc();

        echo json_encode([
            'success' => true,
            'team' => $team
        ]);
    } elseif ($action === 'update') {
        $input = json_decode(file_get_contents('php://input'), true);

        $slot1 = $input['slot1'] ?? null;
        $slot2 = $input['slot2'] ?? null;
        $slot3 = $input['slot3'] ?? null;
        $slot4 = $input['slot4'] ?? null;
        $slot5 = $input['slot5'] ?? null;
        $slot6 = $input['slot6'] ?? null;

        // Check if team exists
        $checkStmt = $conn->prepare("SELECT id FROM teams WHERE user_id = ?");
        $checkStmt->bind_param('i', $user_id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        $exists = $checkResult->fetch_assoc();

        if ($exists) {
            $updateStmt = $conn->prepare("
                UPDATE teams 
                SET slot1 = ?, slot2 = ?, slot3 = ?, slot4 = ?, slot5 = ?, slot6 = ?
                WHERE user_id = ?
            ");
            $updateStmt->bind_param('iiiiiii', $slot1, $slot2, $slot3, $slot4, $slot5, $slot6, $user_id);
            $updateStmt->execute();
        } else {
            $insertStmt = $conn->prepare("
                INSERT INTO teams (user_id, name, slot1, slot2, slot3, slot4, slot5, slot6)
                VALUES (?, 'Default Team', ?, ?, ?, ?, ?, ?)
            ");
            $insertStmt->bind_param('iiiiiii', $user_id, $slot1, $slot2, $slot3, $slot4, $slot5, $slot6);
            $insertStmt->execute();
        }

        echo json_encode(['success' => true, 'message' => 'Team updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
