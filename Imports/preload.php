<?php

session_status() == PHP_SESSION_NONE ? session_start() : false;

$sharedPages = array("event");
$userPages = array("home", "list", "create-list", "report", "certificate");
$currentPage = substr(basename($_SERVER['PHP_SELF']), 0, -4);

$projectRoot = str_replace($_SERVER['DOCUMENT_ROOT'], "", str_replace(chr(92), "/", getcwd())) . "/";

if (in_array($currentPage, $sharedPages) || in_array($currentPage, $userPages)) {
    // If the user lands on either shared or user pages
    if (in_array($currentPage, $userPages) && !in_array($currentPage, $sharedPages)) {
        // If the user lands on a user page but isn't logged in
        if (!isset($_SESSION['user'])) {
            header("Location: {$projectRoot}login");
            exit();
        }
    }
} else {
    // If the user lands on a public page but is logged in
    if (isset($_SESSION['user'])) {
        header("Location: {$projectRoot}home");
        exit();
    }
}
require_once 'phpDefaults.php';
