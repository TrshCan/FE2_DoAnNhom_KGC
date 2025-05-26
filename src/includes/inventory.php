<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once './Database.php';
$db = new Database();
$conn = Database::$connection;

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT i.item_id, i.quantity, s.name, s.description
    FROM inventory i
    JOIN sundries s ON i.item_id = s.id
    WHERE i.user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$inventory = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $inventory[] = [
            'item_id' => (int)$row['item_id'],
            'quantity' => (int)$row['quantity'],
            'name' => $row['name'],
            'description' => $row['description'],
        ];
    }
    echo json_encode(['success' => true, 'items' => $inventory]);
} else {
    echo json_encode(['success' => false, 'message' => 'Không có vật phẩm nào trong kho.']);
}
