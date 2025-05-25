<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (!isset($_POST['type']) || !isset($_POST['value'])) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$type = $_POST['type'];
$value = (int)$_POST['value'];

$stmt = $conn->prepare("INSERT INTO xp_amounts (type, value) VALUES (?, ?)");
$stmt->bind_param("si", $type, $value);
$stmt->execute();

echo json_encode(["success" => true, "id" => $conn->insert_id]);

$conn->close();
?>