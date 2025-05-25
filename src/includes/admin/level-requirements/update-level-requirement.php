<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (!isset($_POST['level']) || !isset($_POST['xp_required'])) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$level = (int)$_POST['level'];
$xp_required = (int)$_POST['xp_required'];

$stmt = $conn->prepare("UPDATE level_requirements SET xp_required = ? WHERE level = ?");
$stmt->bind_param("ii", $xp_required, $level);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>