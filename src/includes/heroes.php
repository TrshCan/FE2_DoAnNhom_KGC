<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type");
session_start();
header('Content-Type: application/json');

require_once './Database.php';
$db = new Database();
$conn = Database::$connection;

$user_id = $_SESSION['user_id'] ?? $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Fetch all heroes
try {
    $heroesResult = $conn->query("SELECT * FROM heroes");
    $allHeroes = $heroesResult->fetch_all(MYSQLI_ASSOC);

    // Log image paths for debugging
    foreach ($allHeroes as $hero) {
        $imagePath = __DIR__ . "/assets/img/heroes/icon/{$hero['icon']}";
        file_put_contents('debug.log', "Hero: {$hero['name']}, Icon: {$hero['icon']}, Path exists: " . (file_exists($imagePath) ? 'Yes' : 'No') . "\n", FILE_APPEND);
    }

    // Fetch user-owned heroes
    $userHeroesStmt = $conn->prepare("SELECT hero_id FROM user_heroes WHERE user_id = ?");
    $userHeroesStmt->bind_param('i', $user_id);
    $userHeroesStmt->execute();
    $userHeroesResult = $userHeroesStmt->get_result();
    $userHeroes = [];

    while ($row = $userHeroesResult->fetch_assoc()) {
        $userHeroes[] = $row['hero_id'];
    }

    echo json_encode([
        'success' => true,
        'heroes' => $allHeroes,
        'user_heroes' => $userHeroes
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}