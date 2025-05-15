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

$sql = "SELECT h.*, r.name AS region_name, c.name AS class_name 
        FROM heroes h
        LEFT JOIN regions r ON h.region_id = r.id
        LEFT JOIN classes c ON h.class_id = c.id";
$result = $conn->query($sql);

$heroes = [];
while ($row = $result->fetch_assoc()) {
    $heroes[] = $row;
}

echo json_encode($heroes);
