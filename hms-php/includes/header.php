<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? htmlspecialchars($page_title) : "CarePort HMS"; ?></title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome Icons for Medical Glyphs -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <!-- Custom Layout Overrides -->
    <link rel="stylesheet" href="assets/css/custom.css">
</head>
<body class="bg-light">

<?php if (isset($_SESSION['user_id'])): ?>
<!-- Top Horizontal Brand Header -->
<header class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm px-3">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.php">
            <i class="fa-solid fa-square-h text-primary fs-3"></i>
            <span class="fw-bold tracking-tight text-white">CarePort <span class="text-primary text-xs">HMS</span></span>
        </a>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#topNavbar" aria-controls="topNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="topNavbar">
            <div class="navbar-nav ms-auto align-items-center gap-3">
                <div class="nav-item text-light-emphasis text-sm d-none d-md-block">
                    <span class="badge bg-secondary me-1"><?php echo escape($_SESSION['role_name']); ?></span>
                    <strong class="text-white"><?php echo escape($_SESSION['user_name']); ?></strong> 
                </div>
                <a href="index.php?action=logout" class="btn btn-sm btn-outline-danger d-flex align-items-center gap-2">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </a>
            </div>
        </div>
    </div>
</header>

<div class="container-fluid">
    <div class="row">
        <!-- Incorporate Dynamic Sidebar navigation -->
        <?php include_once 'sidebar.php'; ?>
        
        <!-- Main Panel wrapper -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            
            <!-- Session Alert Flashes (Error/Success Feedbacks) -->
            <?php if (isset($_SESSION['flash_success'])): ?>
                <div class="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 shadow-sm" role="alert">
                    <i class="fa-solid fa-circle-check fs-5"></i>
                    <div><?php echo $_SESSION['flash_success']; unset($_SESSION['flash_success']); ?></div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <?php if (isset($_SESSION['flash_error'])): ?>
                <div class="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 shadow-sm" role="alert">
                    <i class="fa-solid fa-circle-exclamation fs-5"></i>
                    <div><?php echo $_SESSION['flash_error']; unset($_SESSION['flash_error']); ?></div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>
<?php endif; ?>
