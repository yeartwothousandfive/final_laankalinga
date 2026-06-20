<?php

session_start();
require_once __DIR__ . '/../connections/conn.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}



function redirect(string $error): never {
    header('Location: ../pages/public/register-senior.html?error=' . urlencode($error));
    exit;
}

if (!$firstName || !$lastName || !$phone || !$dob || !$gender || !$civilStatus || !$houseNo || !$street || !$barangay) {
    redirect('missing_personal_fields');
}

// Added Password Confirmation Check
if ($password !== $confirmPw) {
    redirect('password_mismatch');
}

$query = $connection->prepare("SELECT id FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if($result->num_rows > 0){
    redirect('email_already_exist');
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$role     = 'senior';
$emailVal = $email !== '' ? $email : null;
$profilePicVal = null;

// START TRANSACTION
$connection->begin_transaction();

try {
    $insertUser = $connection->prepare("
        INSERT INTO users
            (first_name, middle_name, last_name, suffix,
             email, password_hash, phone, address, region, philsys_id,
             profile_pic, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $insertUser->bind_param('ssssssssssss', $firstName, $middleName, $lastName, $suffix, $emailVal, $hashedPassword, $phone, $address, $region, $philsysId, $profilePicVal, $role);
    
    if (!$insertUser->execute()) throw new Exception('User insert failed');
    $userId = $connection->insert_id;
    $insertUser->close();

    $insertClient = $connection->prepare("
        INSERT INTO clients
            (user_id, clientFName, clientLName, suffix,
             birthday, birthplace, sex, civilStatus,
             philID, oscaID, email, contactNum, address, region)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insertClient->bind_param('isssssssssssss', $userId, $firstName, $lastName, $suffix, $dob, $birthplace, $gender, $civilStatus, $philsysId, $oscaId, $emailVal, $phone, $address, $region);

    if (!$insertClient->execute()) throw new Exception('Client insert failed');
    $insertClient->close();

    // COMMIT TRANSACTION
    $connection->commit();
    header('Location: ../pages/public/login.php?success=registration_submitted');
    exit;

} catch (Exception $e) {
    // ROLLBACK ON FAILURE
    $connection->rollback();
    error_log('registerSenior Error: ' . $e->getMessage());
    redirect('db_error');
}
?>