<?php

header('Content-Type: application/json');

if (empty($_SESSION['csrf-token'])) {
    $_SESSION['csrf-token'] = bin2hex(random_bytes(32));
}

$headers = apache_request_headers();
if (isset($headers['CSRF-Token'])) {
    if ($headers['CSRF-Token'] !== $_SESSION['csrf-token']) {
        exit(json_encode(['error' => 'Wrong CSRF token']));
    } else {
        exit(json_encode(['error' => 'No CSRF token']));
    }
}
