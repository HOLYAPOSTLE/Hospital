# Comprehensive Hospital Management System (HMS)

A complete, full-featured, responsive Hospital Management System (HMS) built in vanilla PHP 8+ and Bootstrap 5 with standard MySQL backend integration. This system handles the complete patient journey from walk-in to walk-out with role-based access control, interactive reporting, and payment management with insurance reduction.

---

## 🚀 Key Features

1. **Role-Based Access Control (RBAC):** Login portal with secure hashed passwords (`bcrypt`) and session timeouts tailored for 6 roles:
   - **IT Admin:** Full user management, password reset, comprehensive dashboard reporting with visual charts, and action logs.
   - **Doctor:** Patient consultations, diagnosis logs, lab requests, and medicine prescription writing (no billing authorization).
   - **Nurse / Assistant:** Patient registration and vital sign checks.
   - **Lab Technician:** Pending lab requests queue and results uploading.
   - **Receptionist:** Quick patient walk-in, doctor assignment, and terminal reports printing.
   - **Billing Staff:** Insurance verification, copay calculations, payment processing, and walk-out checkout.
2. **Complete Patient Journey Workflow:** Walk-in $\rightarrow$ Vitals $\rightarrow$ Consultation $\rightarrow$ Labs (Technician Upload) $\rightarrow$ Rx Prescription $\rightarrow$ Billing/Insurance Copay $\rightarrow$ Walk-out printout.
3. **IT Admin Reporting Tools:** Real-time summary metric cards, date-range filters, dynamic HTML5 responsive charting (Chart.js), exports (CSV & browser-print PDF), and exhaustive systemic activity logs.
4. **Billing & Insurance Ledger:** Automatic parsing of standard pharmacy master drug inventory and lab master test lists, applying customized co-insurance or flat deductions.

---

## 🛠️ Tech Stack & Prerequisites

- **Backend Platform:** PHP `8.0` or higher (Vanilla syntax with a clean modular MVC-like routing structure).
- **Database Engine:** MySQL `5.7+` or MariaDB.
- **Frontend Assets:** Bootstrap `5.3+` (Responsive CSS Grid, Cards, Modals, Forms & Offcanvases) and standard Vanilla JavaScript.
- **Reporting & Visuals:** Chart.js (or ApexCharts) for dynamic IT reports, and native browser printing or HTML-to-PDF libraries (Dompdf / TCPDF) for walk-out invoice reports.

*Note: For official PDF compilation on server-side via Dompdf, ensure the `PHP GD Extension` and `mbstring` are enabled in your `php.ini` file.*

---

## 📦 File & Folder Directory Structure

The codebase is organized in an MVC-like, clean, and modular file structure:

```text
/project_root
├── hospital.sql                 # MySQL schema, indexes, and initial test data
├── index.php                    # System front controller (router / page dispatcher)
├── config.php                   # Database connection helper utilizing PDO
├── README.md                    # Installation and guide documentation
├── assets/
│   ├── css/
│   │   └── custom.css           # Custom theme colors and sidebar transition rules
│   └── js/
│       ├── main.js              # Standard JS validation and AJAX triggers
│       └── charts.js            # Initializer script for Admin Chart.js Canvas
├── includes/
│   ├── header.php               # High-contrast navigation and CSS CDN linkings
│   ├── sidebar.php              # Dynamic sidebar rendered based on Active Role
│   └── footer.php               # Modals, Bootstrap bundle scripts, and footnotes
├── modules/
│   ├── auth/
│   │   ├── login.php            # Session starting and secure hashed validation
│   │   └── logout.php           # Session flushing and secure redirection
│   ├── patient/
│   │   ├── registration.php     # OP Number generation and patient card creator
│   │   └── vitals.php           # Nurse vital sign inputs (BP, Heart rate, SpO2)
│   ├── doctor/
│   │   └── consultation.php     # Doctor console, medical notes, rx, and lab requests
│   ├── lab/
│   │   └── upload.php           # Tech lab console for listing pending tests and results
│   ├── billing/
│   │   └── payment.php          # Invoice generator, co-pay parser, checkout portal
│   ├── admin/
│   │   ├── database.php         # User accounts CRUD & passwords reset console
│   │   └── reports.php          # Date-range metrics cards, CSV exporter, logs viewer
│   └── reception/
│       └── walkout.php          # Final printable patient summary and discharge PDF
└── reports/
    └── .gitkeep                 # Folder holding server-side generated PDF slips
```

---

## ⚙️ Quick Installation Guide

To deploy this project seamlessly using localized servers like **XAMPP**, **WAMP**, or **LAMP**, follow these steps:

### Step 1: Clone or Copy files
Paste all directory files into your server directory (e.g., `C:/xampp/htdocs/hospital-hms`).

### Step 2: Import the Database Schema
1. Boot up your local MySQL service (e.g., via the XAMPP Control Panel).
2. Visit **phpMyAdmin** in your browser: `http://localhost/phpmyadmin`.
3. Create a clean database named `hospital_db` with collation `utf8mb4_general_ci`.
4. Select the database, navigate to the **Import** tab, choose the `/hospital.sql` file provided, and click **Go** (Import).
   - Alternatively, execute the SQL block in a CLI:
     ```bash
     mysql -u root -p -e "CREATE DATABASE hospital_db;"
     mysql -u root -p hospital_db < hospital.sql
     ```

### Step 3: Configure Database Connection
Open `/config.php` in a text editor and adjust the host, database name, username, and password parameters to match your local setup:
```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'hospital_db');
define('DB_USER', 'root');
define('DB_PASS', ''); // Adjust if your database has a password
```

### Step 4: Access and Sign In
Open your web browser and navigate to:
`http://localhost/hospital-hms`

Sign in with the **Default IT Admin Credentials**:
- **Email:** `admin@hospital.com`
- **Password:** `admin123`

---

## 🔒 Default Role Demo Accounts

For instant testing of separate role permissions, a set of default developer credentials have been seeded into the database schema (`password` for all employee accounts is **`password123`**):

| Role | Demo Username (Email) | Purpose |
| :--- | :--- | :--- |
| **IT Admin** | `admin@hospital.com` | User administration, activity logs, reports (**Password: `admin123`**) |
| **Doctor** | `sarah.doctor@hospital.com` | Patient consultation dashboard, prescriptions, labs (Sarah Connor) |
| **Doctor** | `house.doctor@hospital.com` | Alternate Doctor specialist console (Gregory House) |
| **Nurse** | `joy.nurse@hospital.com` | Patient quick registration and vital signs logging (Nurse Joy) |
| **Lab Technician** | `peter.lab@hospital.com` | Processing pending lab queries and uploading reports (Peter Parker) |
| **Receptionist** | `lois.reception@hospital.com` | Walk-in registration panel, doctor assignment logs (Lois Lane) |
| **Billing Staff** | `bruce.billing@hospital.com` | Accounting console, billing ledger, insurance deductions (Bruce Wayne) |

---

## 💡 System Maintenance Note
- Make sure that the `extension=gd` parameter in `php.ini` has its semicolon (`;`) removed for image manipulation or Dompdf report caching to function correctly.
- Configure `session.gc_maxlifetime` in your `php.ini` file if you wish to adjust the global idle-session timeout for your users automatically.
