<?php
session_start();
require_once './Database.php';

$user_id = $_SESSION['user_id']; // Lấy id user từ session
$conn = Database::$connection;

$today = date('Y-m-d');

// Lấy last_login_date của user
$stmt = $conn->prepare("SELECT last_login_date FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $last_login_date = $row['last_login_date'];

    if ($last_login_date !== $today) {
        // Cập nhật ngày đăng nhập mới
        $stmt_update = $conn->prepare("UPDATE user SET last_login_date = ? WHERE id = ?");
        $stmt_update->bind_param("si", $today, $user_id);
        $stmt_update->execute();

        // Thực hiện thêm item thưởng cho user
        addItemToUser($user_id, $item_id = 1, $quantity = 1);

        echo json_encode(['success' => true, 'message' => 'Bạn đã nhận được phần thưởng đăng nhập hôm nay!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Bạn đã nhận phần thưởng hôm nay rồi.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User không tồn tại.']);
}

function addItemToUser($user_id, $item_id, $quantity) {
    global $conn;
    // Kiểm tra item đã có trong inventory chưa
    $stmt_check = $conn->prepare("SELECT * FROM user_items WHERE user_id = ? AND item_id = ?");
    $stmt_check->bind_param("ii", $user_id, $item_id);
    $stmt_check->execute();
    $res_check = $stmt_check->get_result();

    if ($res_check->num_rows > 0) {
        // Cập nhật số lượng
        $stmt_update = $conn->prepare("UPDATE user_items SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?");
        $stmt_update->bind_param("iii", $quantity, $user_id, $item_id);
        $stmt_update->execute();
    } else {
        // Thêm mới
        $stmt_insert = $conn->prepare("INSERT INTO user_items (user_id, item_id, quantity) VALUES (?, ?, ?)");
        $stmt_insert->bind_param("iii", $user_id, $item_id, $quantity);
        $stmt_insert->execute();
    }
}
?>
