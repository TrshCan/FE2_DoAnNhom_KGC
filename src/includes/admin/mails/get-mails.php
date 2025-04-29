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

// Truy vấn dữ liệu từ bảng mails
$query = "SELECT * FROM mails ORDER BY received_at DESC";
$result = $conn->query($query);

$mails = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $mails[] = $row;
    }
}

echo json_encode($mails);
