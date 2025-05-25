<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (!isset($_POST['user_id']) || !isset($_POST['item_id']) || !isset($_POST['quantity']) || 
    !isset($_POST['original_user_id']) || !isset($_POST['original_item_id'])) {
    echo json_encode(['error' => 'Thiếu dữ liệu bắt buộc để cập nhật']);
    exit;
}

$db = new Database();
$conn = Database::$connection;

$user_id = (int)$_POST['user_id'];
$item_id = (int)$_POST['item_id'];
$quantity = (int)$_POST['quantity'];
$original_user_id = (int)$_POST['original_user_id'];
$original_item_id = (int)$_POST['original_item_id'];

// Check if the record exists before updating
$check_stmt = $conn->prepare("SELECT 1 FROM inventory WHERE user_id = ? AND item_id = ?");
$check_stmt->bind_param("ii", $original_user_id, $original_item_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    echo json_encode(['error' => 'Không tìm thấy bản ghi để cập nhật']);
    $check_stmt->close();
    $conn->close();
    exit;
}
$check_stmt->close();

// Perform the update
$stmt = $conn->prepare("UPDATE inventory SET user_id = ?, item_id = ?, quantity = ? WHERE user_id = ? AND item_id = ?");
$stmt->bind_param("iiiii", $user_id, $item_id, $quantity, $original_user_id, $original_item_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Dữ liệu không thay đổi hoặc bản ghi không tồn tại"]);
    }
} else {
    echo json_encode(["error" => "Lỗi khi cập nhật: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>