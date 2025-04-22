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

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if ($id) {
    $db = new Database();
    $conn = Database::$connection;

    $stmt = $conn->prepare("DELETE FROM heroes WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["status" => "deleted"]);
} else {
    echo json_encode(["status" => "error", "message" => "Missing ID"]);
}
