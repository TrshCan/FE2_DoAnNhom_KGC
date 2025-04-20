<?php
session_start();
session_destroy();
header('Location: ../index.php'); // Optional: redirect to loading screen
exit;
