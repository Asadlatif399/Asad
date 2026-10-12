<?php
// FastSpring webhook: on order.completed, email the buyer a signed 72h download link.
$cfg = require __DIR__ . '/config.php';

$body = file_get_contents('php://input');
$sig  = $_SERVER['HTTP_X_FS_SIGNATURE'] ?? '';
$calc = base64_encode(hash_hmac('sha256', $body, $cfg['webhook_secret'], true));
if (!hash_equals($calc, $sig)) {
    http_response_code(403);
    exit('Bad signature');
}

$payload = json_decode($body, true);
foreach (($payload['events'] ?? []) as $event) {
    if (($event['type'] ?? '') !== 'order.completed') continue;

    $order = $event['data'] ?? [];
    $email = $order['customer']['email'] ?? '';
    $ref   = $order['reference'] ?? ($order['id'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) continue;

    $exp   = time() + $cfg['link_ttl'];
    $lines = [];
    foreach (($order['items'] ?? []) as $item) {
        $file = $cfg['products'][$item['product'] ?? ''] ?? null;
        if (!$file) continue;
        $sig  = hash_hmac('sha256', "$file|$exp", $cfg['link_secret']);
        $lines[] = $item['display'] ?? $file;
        $lines[] = $cfg['site_url'] . '/downloads/download.php?f=' . rawurlencode($file) . "&e=$exp&s=$sig";
        $lines[] = '';
    }
    if (!$lines) continue;

    $msg = "Thank you for your purchase (order $ref).\n\n"
         . "Your download links are valid for 72 hours (until " . gmdate('Y-m-d H:i', $exp) . " UTC):\n\n"
         . implode("\n", $lines)
         . "\nIf a link expires, reply to this email and we will send a new one.\n";
    mail($email, 'Your 3D Luxury Studio download', $msg, 'From: ' . $cfg['from_email']);
}

http_response_code(200);
echo 'ok';
