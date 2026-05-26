-- Hospital Management System Database Schema
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

-- 7. Pharmacy master_drug (Available drugs and pricing)
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

-- =======================================================
-- INSERT INITIAL MOCK DATA
-- =======================================================

-- Roles (IDs match role assignments)
INSERT INTO roles (id, role_name) VALUES
(1, 'IT Admin'),
(2, 'Doctor'),
(3, 'Nurse/Assistant'),
(4, 'Lab Technician'),
(5, 'Receptionist'),
(6, 'Billing Staff')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

-- Pre-populated Lab Master Prices
INSERT INTO lab_master (test_name, price) VALUES
('Complete Blood Count (CBC)', 45.00),
('Blood Glucose / Sugar', 15.00),
('Lipid Profile', 60.00),
('Thyroid Profile (T3, T4, TSH)', 80.00),
('Liver Function Test (LFT)', 70.00),
('Kidney Function Test (KFT)', 65.00),
('Urine Routine Analysis', 20.00),
('Chest X-Ray', 120.00),
('Electrocardiogram (ECG)', 50.00)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Pre-populated Pharmacy Master Prices
INSERT INTO pharmacy_master (drug_name, price) VALUES
('Paracetamol 500mg', 5.00),
('Amoxicillin 250mg', 18.20),
('Ibuprofen 400mg', 8.50),
('Metformin 500mg', 12.00),
('Atorvastatin 10mg', 30.00),
('Omeprazole 20mg', 15.00),
('Amlodipine 5mg', 10.00),
('Cetirizine 10mg', 6.80),
('Azithromycin 500mg', 25.00),
('Salbutamol Inhaler', 45.00)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Users:
-- IT Admin: email = admin@hospital.com, password_hash = bcrypt('admin123')
-- Let's insert the default password hash (bcrypt for 'admin123')
-- Hash for 'admin123' is $2y$10$iI0l9pA0VdPhH8.7f13vYeq3AEPzC24R/yK9pP6i/pG.fR00uOn9q (standard PHP password_hash)
INSERT INTO users (id, name, email, password_hash, role_id) VALUES
(1, 'System Administrator', 'admin@hospital.com', '$2y$10$iI0l9pA0VdPhH8.7f13vYeq3AEPzC24R/yK9pP6i/pG.fR00uOn9q', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Add Default Employees for Easy Demo
-- Password for all is 'password123' => $2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72
INSERT INTO users (id, name, email, password_hash, role_id) VALUES
(2, 'Dr. Sarah Connor', 'sarah.doctor@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 2),
(3, 'Dr. Gregory House', 'house.doctor@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 2),
(4, 'Nurse Joy', 'joy.nurse@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 3),
(5, 'Tech Peter Parker', 'peter.lab@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 4),
(6, 'Receptionist Lois Lane', 'lois.reception@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 5),
(7, 'Billing Accountant Bruce Wayne', 'bruce.billing@hospital.com', '$2y$10$h9WwVnZ93XnL/v68c/zT.u1K0Y3N9pWcoD70RBejY83Dms9zL5v72', 6)
ON DUPLICATE KEY UPDATE name=VALUES(name);
