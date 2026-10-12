<?php
// Serves a file only if the signed link is valid and not expired.
$cfg = require __DIR__ . '/config.php';

$file = basename($_GET['f'] ?? '');
$exp  = (int)($_GET['e'] ?? 0);
$sig  = (string)($_GET['s'] ?? '');

$expected = hash_hmac('sha256', "$file|$exp", $cfg['link_secret']);
if ($file === '' || !hash_equals($expected, $sig)) {
    http_response_code(403);
    exit('Invalid link.');
}
if (time() > $exp) {
    http_response_code(410);
    exit('This link has expired. Please contact us for a new one.');
}

$path = rtrim($cfg['files_dir'], '/') . '/' . $file;
if (!is_file($path)) {
    http_response_code(404);
    exit('File not found.');
}

set_time_limit(0);
while (ob_get_level()) ob_end_clean();
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $file . '"');
header('Content-Length: ' . filesize($path));
header('X-Content-Type-Options: nosniff');
readfile($path);
