<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

// Join with users and heroes to get username and hero name
$query = "SELECT uh.id, uh.user_id, uh.hero_id, uh.level, uh.xp, u.username, h.name AS hero_name 
          FROM user_heroes uh 
          JOIN users u ON uh.user_id = u.id 
          JOIN heroes h ON uh.hero_id = h.id 
          ORDER BY uh.id DESC";
$result = $conn->query($query);

$userHeroes = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $userHeroes[] = $row;
    }
}

echo json_encode($userHeroes);

$conn->close();
?>