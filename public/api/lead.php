<?php
// daryaft-e form-e «darkhast-e tamas» va ferestadan be bot-e Bale
// token va chat_id inja nistan; too-ye lead-config.php hastan ke bayad kharej az public_html (yek sath bala-tar) gozashte beshe
// nemune: server/lead-config.sample.php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reply(int $status, array $data): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'method']);
}

// config: avval yek sath bala-tar az public_html, ba'd kenar-e hamin file
$configPaths = [dirname(__DIR__, 2) . '/lead-config.php', __DIR__ . '/lead-config.php'];
$config = null;
foreach ($configPaths as $path) {
    if (is_file($path)) {
        $config = require $path;
        break;
    }
}
if (!is_array($config) || empty($config['token']) || empty($config['chat_id'])) {
    reply(500, ['ok' => false, 'error' => 'config']);
}

// vorudi: JSON ya form
$raw = file_get_contents('php://input') ?: '';
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

// honeypot: fild-e makhfi ke adam pur nemikone, pas agar por bud robot-e; javab-e movafaq midim ta robot befahme
if (!empty($input['website'])) {
    reply(200, ['ok' => true]);
}

// rate limit sade: har IP hadaksar 5 darkhast too-ye 1 saat
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$limitFile = sys_get_temp_dir() . '/msite-lead-' . md5($ip) . '.json';
$now = time();
$hits = [];
if (is_file($limitFile)) {
    $hits = json_decode((string) file_get_contents($limitFile), true) ?: [];
    $hits = array_values(array_filter($hits, fn ($t) => is_int($t) && $t > $now - 3600));
}
if (count($hits) >= 5) {
    reply(429, ['ok' => false, 'error' => 'rate']);
}

// adad-haye farsi/arabi be englisi
function normalizeDigits(string $s): string
{
    return strtr($s, [
        '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4', '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
        '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4', '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
    ]);
}

function clean(mixed $v, int $max): string
{
    $v = is_string($v) ? trim($v) : '';
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v) ?? '';
    return mb_substr($v, 0, $max);
}

$name = clean($input['name'] ?? '', 80);
$phone = preg_replace('/[\s\-]+/', '', normalizeDigits(clean($input['phone'] ?? '', 20))) ?? '';
$business = clean($input['business'] ?? '', 120);

if (mb_strlen($name) < 3 || $business === '' || !preg_match('/^(\+98|0098|98|0)?9\d{9}$/', $phone)) {
    reply(422, ['ok' => false, 'error' => 'invalid']);
}

$time = (new DateTime('now', new DateTimeZone('Asia/Tehran')))->format('Y-m-d H:i');
$text = "درخواست تماس جدید از سایت\n\n"
    . "نام و نام خانوادگی: $name\n"
    . "شماره تماس: $phone\n"
    . "نوع کسب‌وکار: $business\n\n"
    . "زمان: $time";

$base = rtrim((string) ($config['api_base'] ?? 'https://tapi.bale.ai'), '/');
$url = $base . '/bot' . $config['token'] . '/sendMessage';
$payload = json_encode(['chat_id' => $config['chat_id'], 'text' => $text], JSON_UNESCAPED_UNICODE);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10,
]);
$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$decoded = is_string($response) ? json_decode($response, true) : null;
if ($status !== 200 || !is_array($decoded) || empty($decoded['ok'])) {
    // be khater-e amniyat jozeiat (token) be karbar bargasht dade nemishe
    error_log('lead.php: bale send failed, http ' . $status);
    reply(502, ['ok' => false, 'error' => 'send']);
}

$hits[] = $now;
@file_put_contents($limitFile, json_encode($hits), LOCK_EX);
reply(200, ['ok' => true]);
