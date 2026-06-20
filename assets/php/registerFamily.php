<?php

session_start();
require_once __DIR__ . '/../connections/conn.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}



function redirect(string $error): never {
    header('Location: ../pages/public/register-family.html?error=' . urlencode($error));
    exit;
}

if (!$firstName || !$lastName || !$email || !$phone || !$houseNo || !$street || !$barangay) {
    redirect('missing_personal_fields');
}
if (!$relationship) {
    redirect('missing_relationship');
}

$query = $connection->prepare("SELECT id FROM users WHERE email = ?");
$query->bind_param('s', $email);
$query->execute();
$query->store_result();

if ($query->num_rows > 0) {
    $query->close();
    redirect('email_already_exist');
}
$query->close();

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$role           = 'family';
$emailVal       = $email !== '' ? $email : null;
$profilePicVal  = null;

// START TRANSACTION
$connection->begin_transaction();

try {
    $insertUser = $connection->prepare("
        INSERT INTO users
            (first_name, middle_name, last_name, suffix,
             email, password_hash, phone, address, region,
             profile_pic, role, created_at)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $insertUser->bind_param('sssssssssss', $firstName, $middleName, $lastName, $suffix, $emailVal, $hashedPassword, $phone, $address, $region, $profilePicVal, $role);
    
    if (!$insertUser->execute()) throw new Exception('User insert failed');
    $userId = $connection->insert_id;
    $insertUser->close();

    $canSchedule = 0;
    $insertFamily = $connection->prepare("
        INSERT INTO family_members
            (user_id, alt_phone, relationship, is_primary_decision_maker,
             can_schedule, preferred_contact_method, update_frequency,
             emergency_notifications, care_plan_updates, ofw_status, created_at)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $insertFamily->bind_param('issiissiis', $userId, $altPhone, $relationship, $isDecisionMaker, $canSchedule, $preferredContactMethod, $updateFrequency, $emergencyNotifications, $carePlanUpdates, $ofwStatus);

    if (!$insertFamily->execute()) throw new Exception('Family insert failed');
    $insertFamily->close();

    // COMMIT TRANSACTION
    $connection->commit();
    header('Location: ../pages/public/login.php?success=registration_submitted');
    exit;

} catch (Exception $e) {
    // ROLLBACK ON FAILURE
    $connection->rollback();
    error_log('registerFamily Error: ' . $e->getMessage());
    redirect('db_error');
}
?>