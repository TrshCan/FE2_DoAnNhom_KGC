<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (
    !isset($_POST['item_id']) ||
    !isset($_POST['stat_name']) ||
    !isset($_POST['modifier_type']) ||
    !isset($_POST['value'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$item_id = (int)$_POST['item_id'];
$stat_name = $_POST['stat_name'];
$modifier_type = in_array($_POST['modifier_type'], ['flat', 'percent', 'special']) ? $_POST['modifier_type'] : 'flat';
$value = (float)$_POST['value'];
$note = isset($_POST['note']) && $_POST['note'] !== '' ? $_POST['note'] : null;

$stmt = $conn->prepare("INSERT INTO item_effects (item_id, stat_name, modifier_type, value, note) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issds", $item_id, $stat_name, $modifier_type, $value, $note);
$stmt->execute();

echo json_encode(["success" => true, "id" => $conn->insert_id]);

$conn->close();
?>