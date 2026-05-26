<?php
/**
 * Hospital Management System - Dynamic Role-Based Sidebar Navigation
 */
$current_action = isset($_GET['action']) ? $_GET['action'] : '';
$role_id = $_SESSION['role_id'] ?? 0;
?>

<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse shadow">
    <div class="position-sticky pt-3 sidebar-sticky">
        <ul class="nav flex-column gap-1">
            
            <!-- IT Admin Only Link -->
            <?php if ($role_id == 1): ?>
                <li class="nav-item">
                    <a class="nav-link text-white d-flex align-items-center gap-2 <?php echo $current_action == 'dashboard' ? 'active bg-primary' : 'hover-bg'; ?>" href="index.php?action=dashboard">
                        <i class="fa-solid fa-chart-line"></i>
                        Dashboard & Reports
                    </a>
                </li>
            <?php endif; ?>

            <!-- Receptionist, Nurse or Admin Links -->
            <?php if (in_array($role_id, [1, 3, 5])): ?>
                <div class="sidebar-heading px-3 mt-3 mb-1 text-uppercase text-xs text-muted">Reception & Front Desk</div>
                <li class="nav-item">
                    <a class="nav-link text-white d-flex align-items-center gap-2 <?php echo $current_action == 'registration' ? 'active bg-primary' : 'hover-bg'; ?>" href="index.php?action=registration">
                        <i class="fa-solid fa-user-plus"></i>
                        Patient Intake
                    </a>
                </li>
            <?php endif; ?>

            <!-- Nurse and Admin Vitals check link -->
            <?php if (in_array($role_id, [1, 3])): ?>
                <li class="nav-item">
                    <a class="nav-link text-white d-flex align-items-center gap-2 <?php echo $current_action == 'vitals' ? 'active bg-primary' : 'hover-bg'; ?>" href="index.php?action=vitals">
                        <i class="fa-solid fa-heart-pulse"></i>
                        Vitals Tracking
                    </a>
                </li>
            <?php endif; ?>

            <!-- Doctor or Admin Clinical console -->
            <?php if (in_array($role_id, [1, 2])): ?>
                <div class="sidebar-heading px-3 mt-3 mb-1 text-uppercase text-xs text-muted">Clinical Services</div>
                <li class="nav-item">
                    <a class="nav-link text-white d-flex align-items-center gap-2 <?php echo $current_action == 'consultation' ? 'active bg-primary' : 'hover-bg'; ?>" href="index.php?action=consultation">
                        <i class="fa-solid fa-stethoscope"></i>
                        Doctor Console
                    </a>
                </li>
            <?php endif; ?>

            <!-- Lab Tech and Admin pending queues -->
            <?php if (in_array($role_id, [1, 4])): ?>
                <div class="sidebar-heading px-3 mt-3 mb-1 text-uppercase text-xs text-muted">Diagnostics</div>
                <li class="nav-item">
                    <a class="nav-link text-white d-flex align-items-center gap-2 <?php echo $current_action == 'lab' ? 'active bg-primary' : 'hover-bg'; ?>" href="index.php?action=lab">
                        <i class="fa-solid fa-flask-vial"></i>
                        Laboratory Queue
                    </a>
                </li>
            <?php endif; ?>

            <!-- Billing Staff and Admin links -->
            <?php if (in_array($role_id, [1, 6])): ?>
                <div class="sidebar-heading px-3 mt-3 mb-1 text-uppercase text-xs text-muted">Accounts Ledger</div>
                <li class="nav-item">
                    <a class="nav-link text-white d-flex align-items-center gap-2 <?php echo $current_action == 'billing' ? 'active bg-primary' : 'hover-bg'; ?>" href="index.php?action=billing">
                        <i class="fa-solid fa-file-invoice-dollar"></i>
                        Billing Desk
                    </a>
                </li>
            <?php endif; ?>

            <!-- Common Walkout print summaries for allowed roles -->
            <?php if (in_array($role_id, [1, 2, 3, 5, 6])): ?>
                <div class="sidebar-heading px-3 mt-3 mb-1 text-uppercase text-xs text-muted">Discharge</div>
                <li class="nav-item">
                    <a class="nav-link text-white d-flex align-items-center gap-2 <?php echo $current_action == 'walkout' ? 'active bg-primary' : 'hover-bg'; ?>" href="index.php?action=walkout">
                        <i class="fa-solid fa-hospital-user"></i>
                        Discharge Summaries
                    </a>
                </li>
            <?php endif; ?>

            <li class="nav-item mt-4 border-top border-secondary pt-2">
                <a class="nav-link text-danger-emphasis d-flex align-items-center gap-2 hover-bg" href="index.php?action=logout">
                    <i class="fa-solid fa-power-off"></i>
                    Exit Session
                </a>
            </li>
        </ul>
    </div>
</nav>
