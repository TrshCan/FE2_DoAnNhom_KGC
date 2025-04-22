<?php
header("Access-Control-Allow-Origin: *"); //  cho phép mọi origin gọi API này
// Tốt cho dev/test,
// Nhưng khi lên production, nên đổi thành:
//header("Access-Control-Allow-Origin: http://your-frontend-domain.com");
//để bảo vệ backend khỏi bị gọi từ web lạ.
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

$sql = "SELECT id, name FROM classes";
$result = $conn->query($sql);

$classes = [];
while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

echo json_encode($classes);
