<?php
session_start();

header('Content-Type: application/json');

$response = [
  'loggedIn' => isset($_SESSION['email']) && !empty($_SESSION['email'])
];

echo json_encode($response);
