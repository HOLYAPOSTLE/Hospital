<?php
/**
 * Hospital Management System - Config & Environment Setup
 * Database parameters and global helpers.
 */

// Establish standard database constants
define('DB_HOST', 'localhost');
define('DB_NAME', 'hospital_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Optional System Configurations
define('SESSION_TIMEOUT', 1800); // 30 minutes in seconds
define('CURRENCY_SYMBOL', '$');

// Start secure custom session
if (session_status() === PHP_SESSION_NONE) {
    // Force cookies to be HTTPOnly for secure storage
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    session_start();
}

/**
 * Get unified Database PDO connection instance.
 */
function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // In a production app, redirect to a friendly offline error page.
            die("Critical Database Connection Failure: " . htmlspecialchars($e->getMessage()));
        }
    }
    return $pdo;
}

/**
 * XSS prevention escaping helper.
 */
function escape($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Redirect immediately with absolute session pathing.
 */
function redirect($url) {
    header("Location: " . $url);
    exit;
}

/**
 * Check if the active session matches any of the specified roles.
 * @param array $allowed_roles String names or integer role-IDs.
 */
function checkRole($allowed_roles) {
    if (!isset($_SESSION['user_id'])) {
        redirect('index.php?action=login');
    }
    
    // Auto-timeout validation
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
        session_unset();
        session_destroy();
        redirect('index.php?action=login&timeout=1');
    }
    $_SESSION['last_activity'] = time();

    if (!in_array($_SESSION['role_name'], $allowed_roles) && !in_array($_SESSION['role_id'], $allowed_roles)) {
        // Render 403 Forbidden
        http_response_code(403);
        die("Unauthorized Access: You do not have permissions to view this terminal.");
    }
}

/**
 * Write action logs for IT auditors.
 */
function logActivity($user_id, $action) {
    try {
        $db = getDBConnection();
        $stmt = $db->prepare("INSERT INTO user_activity_logs (user_id, action, ip_address) VALUES (?, ?, ?)");
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt->execute([$user_id, $action, $ip]);
    } catch (Exception $e) {
        // Silently ignore log errors to protect patient flow continuity
    }
}
