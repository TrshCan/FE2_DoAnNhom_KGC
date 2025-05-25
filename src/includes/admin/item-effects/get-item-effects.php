<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
require_once '../../../includes/Database.php';
header("Content-Type: application/json");

$db = new Database();
$conn = Database::$connection;

// Join with sundries to get sundry_name
$query = "SELECT ie.id, ie.item_id, ie.stat_name, ie.modifier_type, ie.value, ie.note, s.name AS sundry_name 
          FROM item_effects ie 
          JOIN sundries s ON ie.item_id = s.id 
          ORDER BY ie.id DESC";
$result = $conn->query($query);

$itemEffects = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $itemEffects[] = $row;
    }
}

echo json_encode($itemEffects);

$conn->close();
?>