<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once './Database.php';
$db = new Database();
$conn = Database::$connection;

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Kết nối cơ sở dữ liệu thất bại']);
    exit;
}

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM inventory WHERE user_id = ? ORDER BY item_id DESC");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Lỗi truy vấn cơ sở dữ liệu']);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $items[] = [
            'user_id' => $row['user_id'],
            'item_id' => $row['item_id'],
            'quantity' => $row['quantity'],
        ];
    }
    echo json_encode(['success' => true, 'items' => $items]);
} else {
    echo json_encode(['success' => false, 'message' => 'Không có vật phẩm nào']);
}

$stmt->close();
$conn->close();
?>