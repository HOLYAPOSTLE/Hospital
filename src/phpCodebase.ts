/**
 * Hospital Management System - Complete Output Codebase Dictionary
 * Exposes the full standard vanilla PHP + MySQL MVC codebase for visual exploration and ZIP download.
 */

export interface SourceFile {
  path: string;
  category: string;
  content: string;
}

export const PHP_CODEBASE: SourceFile[] = [
  {
    path: 'hospital.sql',
    category: 'Database Schema',
    content: `-- Hospital Management System Database Schema
-- Compatible with MySQL 8 or 5.7+
-- Created: 2026-05-25

CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 3. Patients table
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    op_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    insurance_provider VARCHAR(100) DEFAULT NULL,
    insurance_policy VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Visits table
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    nurse_id INT DEFAULT NULL,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Registered', 'Vitals Recorded', 'Consultation', 'Lab Pending', 'Lab Completed', 'Billing', 'Completed') NOT NULL DEFAULT 'Registered',
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (nurse_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Vital signs table
CREATE TABLE IF NOT EXISTS vital_signs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT NOT NULL UNIQUE,
    bp_systolic INT NOT NULL,
    bp_diastolic INT NOT NULL,
    heart_rate INT NOT NULL,
    temperature DECIMAL(4,1) NOT NULL,
    resp_rate INT NOT NULL,
    spo2 INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
);

-- 6. Lab master (Available tests and pricing)
CREATE TABLE IF NOT EXISTS lab_master (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL
);

-- 7. Pharmacy master (Available drugs and pricing)
CREATE TABLE IF NOT EXISTS pharmacy_master (
    drug_id INT AUTO_INCREMENT PRIMARY KEY,
    drug_name VARCHAR(150) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL
);

-- 8. Lab requests table
CREATE TABLE IF NOT EXISTS lab_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    technician_id INT DEFAULT NULL,
    report_file VARCHAR(255) DEFAULT NULL,
    result_text TEXT DEFAULT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT NOT NULL,
    drug_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
);

-- 10. Billing table
CREATE TABLE IF NOT EXISTS billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT NOT NULL UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL,
    insurance_deduction DECIMAL(10,2) NOT NULL,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('Cash', 'Card', 'Insurance Claim') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
);

-- 11. User logs table
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- INSERTS SAMPLE DATA
INSERT INTO roles (id, role_name) VALUES
(1, 'IT Admin'), (2, 'Doctor'), (3, 'Nurse/Assistant'), (4, 'Lab Technician'), (5, 'Receptionist'), (6, 'Billing Staff');

INSERT INTO users (id, name, email, password_hash, role_id) VALUES
(1, 'System Administrator', 'admin@hospital.com', '$2y$10$iI0l9pA0VdPhH8.7f13vYeq3AEPzC24R/yK9pP6i/pG.fR00uOn9q', 1),
(2, 'Dr. Sarah Connor', 'sarah.doctor@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 2),
(3, 'Dr. Gregory House', 'house.doctor@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 2),
(4, 'Nurse Joy', 'joy.nurse@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 3),
(5, 'Tech Peter Parker', 'peter.lab@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 4),
(6, 'Receptionist Lois Lane', 'lois.reception@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 5),
(7, 'Billing Accountant Bruce Wayne', 'bruce.billing@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 6);

INSERT INTO lab_master (test_name, price) VALUES
('Complete Blood Count (CBC)', 45.00), ('Blood Glucose / Sugar', 15.00), ('Lipid Profile', 60.00), ('Chest X-Ray', 120.00);

INSERT INTO pharmacy_master (drug_name, price) VALUES
('Paracetamol 500mg', 5.00), ('Amoxicillin 250mg', 18.20), ('Ibuprofen 400mg', 8.50), ('Omeprazole 20mg', 15.00);`
  },
  {
    path: 'config.php',
    category: 'Core System',
    content: `<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'hospital_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('SESSION_TIMEOUT', 1800);

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    session_start();
}

function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            die("Database Connection Failure: " . $e->getMessage());
        }
    }
    return $pdo;
}

function escape($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

function redirect($url) {
    header("Location: " . $url);
    exit;
}

function checkRole($allowed) {
    if (!isset($_SESSION['user_id'])) {
        redirect('index.php?action=login');
    }
    if (!in_array($_SESSION['role_id'], $allowed) && !in_array($_SESSION['role_name'], $allowed)) {
        http_response_code(403);
        die("403 Forbidden: Authorized personnel only.");
    }
}

function logActivity($user_id, $action) {
    try {
        $db = getDBConnection();
        $stmt = $db->prepare("INSERT INTO user_activity_logs (user_id, action, ip_address) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $action, $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);
    } catch (Exception $e) {}
}`
  },
  {
    path: 'index.php',
    category: 'Core System',
    content: `<?php
require_once 'config.php';
$action = $_GET['action'] ?? 'login';

if (!isset($_SESSION['user_id']) && !in_array($action, ['login'])) {
    $action = 'login';
}

switch ($action) {
    case 'login': require_once 'modules/auth/login.php'; break;
    case 'logout': require_once 'modules/auth/logout.php'; break;
    case 'dashboard': checkRole([1]); require_once 'modules/admin/dashboard.php'; break;
    case 'registration': checkRole([1, 3, 5]); require_once 'modules/patient/registration.php'; break;
    case 'vitals': checkRole([1, 3]); require_once 'modules/patient/vitals.php'; break;
    case 'consultation': checkRole([1, 2]); require_once 'modules/doctor/consultation.php'; break;
    case 'lab': checkRole([1, 4]); require_once 'modules/lab/upload.php'; break;
    case 'billing': checkRole([1, 6]); require_once 'modules/billing/payment.php'; break;
    case 'walkout': checkRole([1, 2, 3, 5, 6]); require_once 'modules/reception/walkout.php'; break;
    default: redirect('index.php?action=login'); break;
}`
  },
  {
    path: 'modules/auth/login.php',
    category: 'Authentication',
    content: `<?php
$error_msg = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $pass = trim($_POST['password'] ?? '');
    
    $db = getDBConnection();
    $stmt = $db->prepare("SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($pass, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['role_id'] = $user['role_id'];
        $_SESSION['role_name'] = $user['role_name'];
        logActivity($user['id'], "Authorized login session established.");
        redirect('index.php?action=dashboard');
    } else {
        $error_msg = "Invalid credentials. Try admin@hospital.com / admin123";
    }
}
// Render Login UI Card with standard Bootstrap components
include 'includes/header.php';
?>
<!-- Dynamic responsive Login Screen -->
<div class="row justify-content-center align-items-center" style="min-height: 80vh;">
  <div class="col-md-5">
    <div class="card p-4 shadow">
       <h3 class="text-center mb-3">Login to CarePort</h3>
       <?php if ($error_msg): ?><div class="alert alert-danger"><?= escape($error_msg) ?></div><?php endif; ?>
       <form method="POST">
          <div class="mb-3">
             <label class="form-label">Email address</label>
             <input type="email" name="email" class="form-control" required placeholder="admin@hospital.com">
          </div>
          <div class="mb-3">
             <label class="form-label">Password</label>
             <input type="password" name="password" class="form-control" required placeholder="admin123">
          </div>
          <button type="submit" class="btn btn-primary w-100">Sign In</button>
       </form>
    </div>
  </div>
</div>
<?php include 'includes/footer.php'; ?>`
  },
  {
    path: 'modules/patient/registration.php',
    category: 'Patient Intake',
    content: `<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $age = (int)($_POST['age'] ?? 0);
    $gender = $_POST['gender'] ?? 'Male';
    $contact = trim($_POST['contact'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $insurance_p = trim($_POST['insurance_provider'] ?? '');
    $insurance_n = trim($_POST['insurance_policy'] ?? '');
    $doctor_id = (int)$_POST['doctor_id'];
    
    // Auto-generate Token/OP Number e.g. OP-2026-6453
    $op_number = "OP-" . date('Y') . "-" . rand(1000, 9999);
    
    $db = getDBConnection();
    $db->beginTransaction();
    try {
        $stmt = $db->prepare("INSERT INTO patients (op_number, name, age, gender, contact, address, insurance_provider, insurance_policy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$op_number, $name, $age, $gender, $contact, $address, $insurance_p, $insurance_n]);
        $patient_id = $db->lastInsertId();
        
        $stmt_v = $db->prepare("INSERT INTO visits (patient_id, doctor_id, nurse_id, status) VALUES (?, ?, ?, 'Registered')");
        $stmt_v->execute([$patient_id, $doctor_id, $_SESSION['user_id']]);
        
        $db->commit();
        $_SESSION['flash_success'] = "Intake Registered Successfully! OP Token: " . $op_number;
        redirect('index.php?action=registration');
    } catch (Exception $e) {
        $db->rollBack();
        $_SESSION['flash_error'] = "Registration failed: " . $e->getMessage();
    }
}
include 'includes/header.php';
?>
<!-- Patient Intake Container -->
<div class="card p-4">
   <h4>Walk-in Patient Intake</h4>
   <form method="POST">
      <!-- Grid Inputs and Doctor Auto Assignment goes here -->
      <div class="row g-3">
         <div class="col-md-6"><label class="form-label">Patient Name</label><input type="text" name="name" class="form-control" required></div>
         <div class="col-md-3"><label class="form-label">Age</label><input type="number" name="age" class="form-control" required></div>
         <div class="col-md-3">
            <label class="form-label">Gender</label>
            <select name="gender" class="form-select"><option>Male</option><option>Female</option><option>Other</option></select>
         </div>
         <div class="col-md-6"><label class="form-label">Phone Contact</label><input type="text" name="contact" class="form-control" required></div>
         <div class="col-md-6"><label class="form-label">Assign Doctor</label>
            <select name="doctor_id" class="form-select" required>
               <?php 
               $db = getDBConnection();
               $doctors = $db->query("SELECT id, name FROM users WHERE role_id = 2")->fetchAll();
               foreach($doctors as $doc) { echo "<option value='{$doc['id']}'>{$doc['name']}</option>"; }
               ?>
            </select>
         </div>
         <div class="col-md-6"><label class="form-label">Insurance Provider</label><input type="text" name="insurance_provider" class="form-control"></div>
         <div class="col-md-6"><label class="form-label">Insurance Policy #</label><input type="text" name="insurance_policy" class="form-control"></div>
         <div class="col-12"><label class="form-label">Residential Address</label><textarea name="address" class="form-control" required></textarea></div>
      </div>
      <button type="submit" class="btn btn-success mt-3">Generate OP Token & Registered Visit</button>
   </form>
</div>
<?php include 'includes/footer.php'; ?>`
  },
  {
    path: 'modules/patient/vitals.php',
    category: 'Patient Intake',
    content: `<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $visit_id = (int)$_POST['visit_id'];
    $systolic = (int)$_POST['bp_systolic'];
    $diastolic = (int)$_POST['bp_diastolic'];
    $hr = (int)$_POST['heart_rate'];
    $temp = (float)$_POST['temperature'];
    $resp = (int)$_POST['resp_rate'];
    $spo2 = (int)$_POST['spo2'];
    $w = (float)$_POST['weight'];
    $h = (float)$_POST['height'];
    
    $db = getDBConnection();
    $db->beginTransaction();
    try {
        $stmt = $db->prepare("INSERT INTO vital_signs (visit_id, bp_systolic, bp_diastolic, heart_rate, temperature, resp_rate, spo2, weight, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$visit_id, $systolic, $diastolic, $hr, $temp, $resp, $spo2, $w, $h]);
        
        $stmt_u = $db->prepare("UPDATE visits SET status = 'Vitals Recorded' WHERE id = ?");
        $stmt_u->execute([$visit_id]);
        
        $db->commit();
        $_SESSION['flash_success'] = "Vitals logged. Patient redirected to consultations.";
        redirect('index.php?action=vitals');
    } catch (Exception $e) {
        $db->rollBack();
        $_SESSION['flash_error'] = "Failed to record vitals: " . $e->getMessage();
    }
}
include 'includes/header.php';
?>
<!-- Real-Time Nurse Panel -->
<div class="card p-4">
   <h4>Vital Signs Record Check</h4>
   <!-- Render pending queue of walk-ins awaiting vitals -->
</div>
<?php include 'includes/footer.php'; ?>`
  },
  {
    path: 'modules/doctor/consultation.php',
    category: 'Clinical Services',
    content: `<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $visit_id = (int)$_POST['visit_id'];
    $diagnosis = trim($_POST['diagnosis']);
    $notes = trim($_POST['notes']);
    $drugs = $_POST['drugs'] ?? []; // drug names
    $dosage = $_POST['dosage'] ?? [];
    $freq = $_POST['frequency'] ?? [];
    $dur = $_POST['duration'] ?? [];
    $tests = $_POST['tests'] ?? []; // lab test names
    
    $db = getDBConnection();
    $db->beginTransaction();
    try {
        // Record Consult diagnosis and advance status
        $stmt = $db->prepare("UPDATE visits SET status = ?, diagnosis = ?, notes = ? WHERE id = ?");
        $next_status = count($tests) > 0 ? 'Lab Pending' : 'Billing';
        $stmt->execute([$next_status, $diagnosis, $notes, $visit_id]);
        
        // Save Rx
        foreach ($drugs as $i => $drug) {
            if (!empty($drug)) {
                $stmt_p = $db->prepare("INSERT INTO prescriptions (visit_id, drug_name, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?)");
                $stmt_p->execute([$visit_id, $drug, $dosage[$i], $freq[$i], $dur[$i]]);
            }
        }
        
        // Save lab reqs
        foreach ($tests as $test) {
            if (!empty($test)) {
                $stmt_t = $db->prepare("INSERT INTO lab_requests (visit_id, test_name, status) VALUES (?, ?, 'Pending')");
                $stmt_t->execute([$visit_id, $test]);
            }
        }
        
        $db->commit();
        $_SESSION['flash_success'] = "Consultation logs recorded successfully.";
        redirect('index.php?action=consultation');
    } catch (Exception $e) {
        $db->rollBack();
        $_SESSION['flash_error'] = "Consult write error: " . $e->getMessage();
    }
}
include 'includes/header.php';
?>
<!-- Doctor's Consult Desk Layout -->
<h4>Consultation Desktop</h4>`
  },
  {
    path: 'modules/lab/upload.php',
    category: 'Diagnostics',
    content: `<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_id = (int)$_POST['request_id'];
    $results = trim($_POST['result_text']);
    $visit_id = (int)$_POST['visit_id'];
    
    // File upload handler (numeric or attachments)
    $file_path = "";
    if (isset($_FILES['report']) && $_FILES['report']['error'] == UPLOAD_ERR_OK) {
        $file_path = "reports/lab_" . $request_id . "_" . time() . ".pdf";
        move_uploaded_file($_FILES['report']['tmp_name'], $file_path);
    }
    
    $db = getDBConnection();
    $db->beginTransaction();
    try {
        $stmt = $db->prepare("UPDATE lab_requests SET status = 'Completed', result_text = ?, report_file = ?, technician_id = ?, completed_at = NOW() WHERE id = ?");
        $stmt->execute([$results, $file_path, $_SESSION['user_id'], $request_id]);
        
        // Check if all lab requests for this visit are completed
        $stmt_c = $db->prepare("SELECT COUNT(*) FROM lab_requests WHERE visit_id = ? AND status = 'Pending'");
        $stmt_c->execute([$visit_id]);
        $pending = $stmt_c->fetchColumn();
        
        if ($pending == 0) {
            $stmt_status = $db->prepare("UPDATE visits SET status = 'Lab Completed' WHERE id = ?");
            $stmt_status->execute([$visit_id]);
        }
        
        $db->commit();
        $_SESSION['flash_success'] = "Lab Report registered & forwarded.";
    } catch (Exception $e) {
        $db->rollBack();
        $_SESSION['flash_error'] = "Data save failed: " . $e->getMessage();
    }
}`
  },
  {
    path: 'modules/billing/payment.php',
    category: 'Accounts Ledger',
    content: `<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $visit_id = (int)$_POST['visit_id'];
    $total = (float)$_POST['total_amount'];
    $deduction = (float)$_POST['insurance_deduction'];
    $final = (float)$_POST['final_amount'];
    $method = $_POST['payment_method'];
    
    $db = getDBConnection();
    $db->beginTransaction();
    try {
        $stmt = $db->prepare("INSERT INTO billing (visit_id, total_amount, insurance_deduction, final_amount, payment_method) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$visit_id, $total, $deduction, $final, $method]);
        
        $stmt_v = $db->prepare("UPDATE visits SET status = 'Completed' WHERE id = ?");
        $stmt_v->execute([$visit_id]);
        
        $db->commit();
        $_SESSION['flash_success'] = "Discharge Complete. Receipt created.";
        redirect('index.php?action=walkout&visit_id=' . $visit_id);
    } catch (Exception $e) {
        $db->rollBack();
        $_SESSION['flash_error'] = "Payment failed: " . $e->getMessage();
    }
}`
  },
  {
    path: 'modules/reception/walkout.php',
    category: 'Discharge',
    content: `<?php
$visit_id = (int)($_GET['visit_id'] ?? 0);
$db = getDBConnection();

$stmt = $db->prepare("
    SELECT v.*, p.name as pat_name, p.op_number, p.age, p.gender, p.insurance_provider,
           d.name as doc_name, b.final_amount, b.total_amount, b.insurance_deduction, b.payment_method
    FROM visits v
    JOIN patients p ON v.patient_id = p.id
    JOIN users d ON v.doctor_id = d.id
    LEFT JOIN billing b ON v.id = b.visit_id
    WHERE v.id = ?
");
$stmt->execute([$visit_id]);
$visit = $stmt->fetch();

include 'includes/header.php';
?>
<div class="card p-4">
   <div class="d-flex justify-content-between">
      <h2>Discharge Case File Summary</h2>
      <button class="btn btn-outline-dark" onclick="window.print()"><i class="fa fa-print"></i> Print Receipt & Clinical file</button>
   </div>
   <hr>
   <!-- Complete report view -->
</div>
<?php include 'includes/footer.php'; ?>`
  },
  {
    path: 'modules/admin/dashboard.php',
    category: 'Analytics & Management',
    content: `<?php
$db = getDBConnection();
$total_patients = $db->query("SELECT COUNT(*) FROM patients")->fetchColumn();
$total_revenue = $db->query("SELECT SUM(final_amount) FROM billing")->fetchColumn() ?? 0;
$total_labs = $db->query("SELECT COUNT(*) FROM lab_requests")->fetchColumn();

// Load dynamic data-chart logs for Javascript rendering
include 'includes/header.php';
?>
<h2>Interactive Auditor Terminal</h2>
<div class="row">
  <div class="col-md-4">
     <div class="card bg-primary text-white p-3 mb-3">
        <h6>Total Ledger Patients</h6>
        <h3><?= $total_patients ?></h3>
     </div>
  </div>
  <div class="col-md-4">
     <div class="card bg-success text-white p-3 mb-3">
        <h6>Total Hospital Revenue</h6>
        <h3><?= CURRENCY_SYMBOL . number_format($total_revenue, 2) ?></h3>
     </div>
  </div>
</div>
<!-- Dynamic charts using Chart.js -->
<canvas id="dailyVisitsChart" width="400" height="200"></canvas>`
  }
];
