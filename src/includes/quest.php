<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once './Database.php';
$db = new Database();
$conn = Database::$connection;

$result = $conn->query("SELECT * FROM quests ORDER BY created_at DESC");

$quests = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $quests[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'status' => $row['status'],
            'type' => $row['type'],
            'created_at' => $row['created_at'],
        ];
    }

    echo json_encode(['success' => true, 'quests' => $quests]); // ✅ key đã đúng
} else {
    echo json_encode(['success' => false, 'message' => 'Không có nhiệm vụ nào.']);
}
