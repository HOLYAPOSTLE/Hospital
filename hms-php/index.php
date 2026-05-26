<?php
/**
 * Hospital Management System - Router / Entry Controller
 * Handles URL parsing and loads modules accordingly.
 */

require_once 'config.php';

// Parse query action
$action = isset($_GET['action']) ? trim($_GET['action']) : 'login';

// If unauthorized, lock on login view unless querying public auth endpoints
if (!isset($_SESSION['user_id']) && !in_array($action, ['login', 'auth_submit'])) {
    $action = 'login';
}

// Global active subpage indicators
$page_title = "Hospital Management System";

switch ($action) {
    case 'login':
        require_once 'modules/auth/login.php';
        break;

    case 'logout':
        require_once 'modules/auth/logout.php';
        break;

    case 'dashboard':
        checkRole(['IT Admin']);
        require_once 'modules/admin/dashboard.php';
        break;

    case 'registration':
    case 'register_patient':
        checkRole(['IT Admin', 'Receptionist', 'Nurse/Assistant']);
        require_once 'modules/patient/registration.php';
        break;

    case 'vitals':
    case 'record_vitals':
        checkRole(['IT Admin', 'Nurse/Assistant']);
        require_once 'modules/patient/vitals.php';
        break;

    case 'consultation':
    case 'save_consultation':
        checkRole(['IT Admin', 'Doctor']);
        require_once 'modules/doctor/consultation.php';
        break;

    case 'lab':
    case 'upload_lab':
        checkRole(['IT Admin', 'Lab Technician']);
        require_once 'modules/lab/upload.php';
        break;

    case 'billing':
    case 'process_payment':
        checkRole(['IT Admin', 'Billing Staff']);
        require_once 'modules/billing/payment.php';
        break;

    case 'walkout':
    case 'print_walkout':
        checkRole(['IT Admin', 'Receptionist', 'Billing Staff', 'Nurse/Assistant', 'Doctor']);
        require_once 'modules/reception/walkout.php';
        break;

    default:
        // Redirect standard fallbacks based on roles
        if ($_SESSION['role_id'] == 1) redirect('index.php?action=dashboard');
        elseif ($_SESSION['role_id'] == 2) redirect('index.php?action=consultation');
        elseif ($_SESSION['role_id'] == 3) redirect('index.php?action=registration');
        elseif ($_SESSION['role_id'] == 4) redirect('index.php?action=lab');
        elseif ($_SESSION['role_id'] == 5) redirect('index.php?action=registration');
        elseif ($_SESSION['role_id'] == 6) redirect('index.php?action=billing');
        else redirect('index.php?action=login');
        break;
}
