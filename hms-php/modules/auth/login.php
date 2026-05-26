<?php
/**
 * CarePort Hospital Management System - Authentication Logic
 */

$error_msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($email) || empty($password)) {
        $error_msg = "Please enter both email and password.";
    } else {
        try {
            $db = getDBConnection();
            
            // Query user structure coupled with role name
            $stmt = $db->prepare("
                SELECT u.*, r.role_name 
                FROM users u 
                JOIN roles r ON u.role_id = r.id 
                WHERE u.email = ?
            ");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            // Match crypt hash
            if ($user && password_verify($password, $user['password_hash'])) {
                // Initialize session parameters
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['role_id'] = $user['role_id'];
                $_SESSION['role_name'] = $user['role_name'];
                $_SESSION['last_activity'] = time();

                logActivity($user['id'], "User signed in successfully.");

                // Redirect based on authorization role
                if ($user['role_id'] == 1) {
                    redirect('index.php?action=dashboard');
                } elseif ($user['role_id'] == 2) {
                    redirect('index.php?action=consultation');
                } elseif ($user['role_id'] == 3) {
                    redirect('index.php?action=registration');
                } elseif ($user['role_id'] == 4) {
                    redirect('index.php?action=lab');
                } elseif ($user['role_id'] == 5) {
                    redirect('index.php?action=registration');
                } elseif ($user['role_id'] == 6) {
                    redirect('index.php?action=billing');
                } {
                    redirect('index.php');
                }
            } else {
                $error_msg = "Invalid email or matching password key.";
            }
        } catch (Exception $e) {
            $error_msg = "An error occurred during authentication: " . htmlspecialchars($e->getMessage());
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Hospital Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            font-family: 'Inter', system-ui, sans-serif;
        }
        .login-card {
            border: none;
            border-radius: 1.25rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
    </style>
</head>
<body>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
            <div class="text-center mb-4">
                <i class="fa-solid fa-square-h text-primary" style="font-size: 4rem;"></i>
                <h2 class="text-white fw-bold mt-2">CarePort HMS</h2>
                <p class="text-muted text-sm">Clinical Administration Dashboard</p>
            </div>

            <div class="card login-card p-4">
                <h4 class="fw-bold mb-3 text-dark text-center">Secure Portal Login</h4>
                
                <?php if (!empty($error_msg)): ?>
                    <div class="alert alert-danger px-3 py-2 text-sm d-flex align-items-center gap-2" role="alert">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <div><?php echo escape($error_msg); ?></div>
                    </div>
                <?php endif; ?>

                <form method="POST" action="index.php?action=login" class="needs-validation" novalidate>
                    <div class="mb-3">
                        <label for="email" class="form-label text-sm fw-medium">Work Email Address</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-envelope text-muted"></i></span>
                            <input type="email" class="form-control" id="email" name="email" placeholder="admin@hospital.com" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="password" class="form-label text-sm fw-medium">Access Code / Password</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-lock text-muted"></i></span>
                            <input type="password" class="form-control" id="password" name="password" placeholder="••••••••" required>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-full py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2">
                        <i class="fa-solid fa-shield-halved"></i> Authorize & Enter
                    </button>
                </form>

                <div class="mt-4 border-top pt-3 text-center text-xs text-muted">
                    <p class="mb-1">Demo login credentials:</p>
                    <strong class="text-dark">admin@hospital.com</strong> &middot; <span class="text-dark">admin123</span>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
