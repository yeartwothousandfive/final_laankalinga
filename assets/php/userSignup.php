<?php

session_start();

require_once __DIR__. '/../connections/conn.php';

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    http_response_code(403);
    exit("forbidden");
}

// Added role retrieval with a default fallback
$role = $_POST['role'] ?? 'user';

// Get Personal Information
$fName = $_POST['first_name'] ?? '';
$mName = $_POST['middle_name'] ?? '';
$lName = $_POST['last_name'] ?? '';
$suffix = $_POST['suffix'] ?? '';
$email = $_POST['email'] ?? '';
$pass = $_POST['password'] ?? ''; // Fixed empty POST key
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';
$region = $_POST['region'] ?? '';
$philID = $_POST['philsys_id'] ?? '';

// ... [Background, Emergency Contact, Documents, Availability variables remain same as your original] ...

$hashedPassword = password_hash($pass, PASSWORD_DEFAULT);

if(!$fName || !$lName || !$email || !$address || !$pass){
    header("Location: ../pages/public/createAcc.php?error=invalid");
    exit;
}

$check = $connection->prepare("
    SELECT role_id FROM logindata
    WHERE email = ?
");

$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if($result->num_rows > 0){
    header("Location: ../pages/public/createAcc.php?error=email_exists");
    exit;
}

$insert = $connection->prepare("
    INSERT INTO logindata
    (role, email, password, firstN, lastN, address)
    VALUES(?, ?, ?, ?, ?, ?)
");

$insert->bind_param(
    "ssssss",
    $role, // Now properly defined
    $email,
    $hashedPassword,
    $fName,
    $lName,
    $address
);

// Execute and check
if ($insert->execute()) {
    header("Location: ../pages/public/login.php?success=Successfully_Created");
    exit;
} else {
    // Moved error log BEFORE exit
    error_log("Error: " . $insert->error); 
    header("Location: ../pages/public/createAcc.php?error=db_error");
    exit;
}

$insert->close();
$connection->close();
?>