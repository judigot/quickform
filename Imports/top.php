<?php
$projectRoot = str_replace($_SERVER['DOCUMENT_ROOT'], "", str_replace(chr(92), "/", getcwd())) . "/";

require_once 'default.php';
require_once 'custom.php';

$CurrentPage = substr(basename($_SERVER['PHP_SELF']), 0, -4);
$SiteName = "Quickform";
$PageTitle;

// Page Title Declarations
switch ($CurrentPage) {
    case "index":
        $PageTitle = "$SiteName - Customizable Attendance-Monitoring System";
        break;

    case "login":
        $PageTitle = "Log in to Quickform - $SiteName";
        break;

    case "signup":
        $PageTitle = "Sign up for Quickform - $SiteName";
        break;

    case "home":
        $PageTitle = $SiteName;
        break;

    case "event":
        $PageTitle = "Event - " . $SiteName;
        break;

    case "list":
        $PageTitle = $SiteName;
        break;

    case "create-list":
        $PageTitle = "Create list - $SiteName";
        break;

    default:
        $PageTitle = "Untitled page!";
}
?>
<title><?php echo $PageTitle; ?></title>