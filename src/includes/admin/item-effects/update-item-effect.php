<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (
    !isset($_POST['id']) ||
    !isset($_POST['item_id']) ||
    !isset($_POST['stat_name']) ||
    !isset($_POST['modifier_type']) ||
    !isset($_POST['value'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$item_id = (int)$_POST['item_id'];
$stat_name = $_POST['stat_name'];
$modifier_type = in_array($_POST['modifier_type'], ['flat', 'percent', 'special']) ? $_POST['modifier_type'] : 'flat';
$value = (float)$_POST['value'];
$note = isset($_POST['note']) && $_POST['note'] !== '' ? $_POST['note'] : null;

$stmt = $conn->prepare("UPDATE item_effects SET item_id = ?, stat_name = ?, modifier_type = ?, value = ?, note = ? WHERE id = ?");
$stmt->bind_param("issdsi", $item_id, $stat_name, $modifier_type, $value, $note, $id);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>