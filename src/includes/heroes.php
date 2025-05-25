<?php
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

try {
    // Fetch user's heroes with their stats, hero info, XP, and XP needed for next level
    $stmt = $conn->prepare("
        SELECT 
            uh.id AS user_hero_id, uh.level, uh.xp,
            h.id AS hero_id, h.name, h.card, h.illustration,
            c.name AS class, r.name AS region,
            s.ATK, s.Spell, s.Spell_DEF, s.Physical_DEF, s.HP, s.MP, s.Mighty_Block,
            COALESCE((SELECT xp_required FROM level_requirements lr WHERE lr.level = uh.level + 1), 0) AS xp_for_next_level,
            COALESCE((SELECT xp_required FROM level_requirements lr WHERE lr.level = uh.level + 1) - uh.xp, 0) AS xp_to_next_level
        FROM user_heroes uh
        JOIN heroes h ON uh.hero_id = h.id
        JOIN user_hero_stats s ON uh.id = s.user_hero_id
        JOIN classes c ON h.class_id = c.id
        JOIN regions r ON h.region_id = r.id
        WHERE uh.user_id = ?
    ");

    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $heroes = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'success' => true,
        'heroes' => $heroes
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}
?>