<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (!isset($_POST['level']) || !isset($_POST['xp_required'])) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$level = (int)$_POST['level'];
$xp_required = (int)$_POST['xp_required'];

$stmt = $conn->prepare("INSERT INTO level_requirements (level, xp_required) VALUES (?, ?)");
$stmt->bind_param("ii", $level, $xp_required);
$stmt->execute();

echo json_encode(["success" => true, "level" => $level]);

$conn->close();
?>