<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (!isset($_POST['title']) || !isset($_POST['type'])) {
    echo json_encode(['error' => 'Missing required data']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$title = $_POST['title'];
$description = $_POST['description'] ?? null;
$status = $_POST['status'] ?? 'Pending';
$type = $_POST['type'];

$stmt = $conn->prepare("INSERT INTO quests (title, description, status, type) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $title, $description, $status, $type);
$stmt->execute();

echo json_encode(["success" => true, "id" => $conn->insert_id]);

$conn->close();
?>