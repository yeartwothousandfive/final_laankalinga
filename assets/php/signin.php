<?php

session_start();

require_once __DIR__. '/../connections/conn.php';

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    http_response_code(403);
    exit("forbidden");
}

$email = $_POST['email'] ?? '';
$pass = $_POST['password'] ?? '';
$role = $_POST['role'] ?? '';

if(!$email || !$pass){
    die("Missing fields");
}

// FIND USER 
$query = $connection->prepare("
    SELECT * FROM users
    WHERE email = ?
");

$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

// CHECK IF EMAIL EXISTS 
if($result->num_rows !== 1){
    header("Location: ../pages/public/login.php?error=invalid");
    exit;
}

$user = $result->fetch_assoc();

// VERIFY PASSWORD 
if(!password_verify($pass, $user['password_hash'])){
    header("Location: ../pages/public/login.php?error=invalid");
    exit;
}

// LOGIN SUCCESS (Regenerate session ID to prevent session fixation)
session_regenerate_id(true);

$_SESSION['user_id'] = $user['id'];
$_SESSION['email'] = $user['email'];
$_SESSION['role'] = $user['role'];

// REDIRECT BASED ON ROLE (Fixed missing /pages/ directory in paths)
switch ($user['role']) {
    case 'senior':
        header("Location: ../pages/senior/dashboard.html");
        break;
    case 'family':
        header("Location: ../pages/senior/fam-dashboard.html");
        break;
    case 'volunteer':
        header("Location: ../pages/volunteer/dashboard.html");
        break;
    default:
        header("Location: ../pages/public/login.php?error=invalid");
        break;
}
exit;

?>