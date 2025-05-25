<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (!isset($_POST['id']) || !isset($_POST['title']) || !isset($_POST['type'])) {
    echo json_encode(['error' => 'Missing required data to update']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$title = $_POST['title'];
$description = $_POST['description'] ?? null;
$status = $_POST['status'] ?? 'Pending';
$type = $_POST['type'];

$stmt = $conn->prepare("UPDATE quests SET title = ?, description = ?, status = ?, type = ? WHERE id = ?");
$stmt->bind_param("ssssi", $title, $description, $status, $type, $id);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>