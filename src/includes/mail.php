<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once './Database.php';
$db = new Database();
$conn = Database::$connection;

$result = $conn->query("SELECT * FROM mails ORDER BY received_at DESC");

$mails = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $mails[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'sender_email' => $row['sender_email'],
            'receiver_email' => $row['receiver_email'],
            'received_at' => $row['received_at']
        ];
    }

    echo json_encode(['success' => true, 'mails' => $mails]);
} else {
    echo json_encode(['success' => false, 'message' => 'Không có thư nào.']);
}

