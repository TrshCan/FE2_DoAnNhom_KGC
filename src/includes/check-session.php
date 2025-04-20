<?php
session_start();
header('Content-Type: application/json');

$response = ['loggedIn' => false];

if (isset($_SESSION['user_id'])) {
    $response['loggedIn'] = true;
}

echo json_encode($response);
