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

$name = $data['name'] ?? '';
$region_id = $data['region_id'] ?? null;
$class_id = $data['class_id'] ?? null;
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';

if ($name && $title) {
    $db = new Database();
    $conn = Database::$connection;

    $stmt = $conn->prepare("INSERT INTO heroes (name, region_id, class_id, title, description) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("siiss", $name, $region_id, $class_id, $title, $description);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Name and Title are required"]);
}
