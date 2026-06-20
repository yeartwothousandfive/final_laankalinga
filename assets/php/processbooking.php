<?php

session_start();

require_once __DIR__. '/../connections/conn.php';

// Auth Check - Ensure user is actually logged in before processing a booking
if (!isset($_SESSION['user_id'])) {
    header("Location: ../pages/public/login.php?error=unauthorized");
    exit;
}

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    http_response_code(403);
    exit("forbidden");
}

$errors = [];



if( !$serviceType || !$visitType || !$appointmentDate || !$timeSlot ||
    !$patientName || !$age || !$contactNumber || !$emergencyContact ||
    !$preferredContact || !$reason ){
        header("Location: ../pages/senior/book.php?error=invalid");
        exit;
}

$insert = $connection->prepare("
    INSERT INTO appointments(
        serviceType, serviceOther, visitType, appointmentDate, timeSlot,
        pName, age, contact, emContact, companion, preferredContact,
        reason, specialNeeds
    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$insert) {
    die("Prepare failed: " . $connection->error);
}

$insert->bind_param(
    "ssssssissssss",
    $serviceType, $serviceOther, $visitType, $appointmentDate, $timeSlot,
    $patientName, $age, $contactNumber, $emergencyContact, $companion,
    $preferredContact, $reason, $specialNeeds
);

if ($insert->execute()) {
    header("Location: ../pages/senior/book.php?success=Successfully_Created");
    exit;
} else {
    // Moved error logging before exit
    error_log("Booking Error: " . $insert->error); 
    header("Location: ../pages/senior/book.php?error=db_error");
    exit;
}

$insert->close();
$connection->close();
?>