<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if (
    !isset($_POST['id']) ||
    !isset($_POST['user_id']) ||
    !isset($_POST['hero_id']) ||
    !isset($_POST['level']) ||
    !isset($_POST['xp'])
) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$id = (int)$_POST['id'];
$user_id = (int)$_POST['user_id'];
$hero_id = (int)$_POST['hero_id'];
$level = (int)$_POST['level'];
$xp = (int)$_POST['xp'];

$stmt = $conn->prepare("UPDATE user_heroes SET user_id = ?, hero_id = ?, level = ?, xp = ? WHERE id = ?");
$stmt->bind_param("iiiii", $user_id, $hero_id, $level, $xp, $id);
$stmt->execute();

echo json_encode(["success" => true]);

$conn->close();
?>