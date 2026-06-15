<?php

session_start();

require_once __DIR__. '/../connections/conn.php';

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    http_response_code(403);
    exit("forbidden");
}

$email = $_POST['email'] ?? '';
$pass = $_POST['password'] ?? '';

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

if(!password_verify($pass, $user['password'])){
    header("Location: ../pages/public/login.php?error=invalid");
    exit;
}

// LOGIN SUCCESS

$_SESSION['user_id'] = $user['id'];
$_SESSION['email'] = $user['email'];
$_SESSION['role'] = $user['role'];

// REDIRECT BASED ON ROLE 

if($user['role'] === 'senior'){
    header("Location: ../senior/dashboard.html");
    exit;
}
else{
    header("Location: ../public/login.php?error=invalid");
    exit;
}

?>