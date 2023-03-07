<?php require_once 'Imports/preload.php'; ?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <!--  -->
        <?php include 'Imports/top.php'; ?>
        <link href="Assets/css/animation.css" rel="stylesheet" type="text/css"/>
        <link href="Assets/css/event.css" rel="stylesheet" type="text/css"/>
        <link href="Assets/css/home.css" rel="stylesheet" type="text/css"/>
        <link href="Assets/css/form.css" rel="stylesheet" type="text/css"/>
        <script src="Assets/js/home.js" type="text/javascript"></script>
        <script src="Assets/js/event.js" type="text/javascript"></script>
        <script src="Assets/js/form.js" type="text/javascript"></script>
        <script src="Assets/js/list.js" type="text/javascript"></script>
    </head>

    <body>
        <?php require_once "Partials/navbar.php"; ?>
        <div class="content">
            <div id="sidebar">
                <div id="sidebar-content">
                    <div class="dropdown">
                        <button class="btn dropbtn">New</button>
                        <div class="dropdown-content">
                            <button id="generateEvent" class="btn"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp&nbsp&nbsp&nbsp Event</button>
                            <button id="generateForm" class="btn"><i class="fa fa-file-text" aria-hidden="true"></i>&nbsp&nbsp&nbsp&nbsp Form</button>
                            <button id="generateList" class="btn"><i class="fa fa-list-ul" aria-hidden="true"></i>&nbsp&nbsp&nbsp&nbsp List</button>
                        </div>
                    </div>
                    <hr>
                    <button class="btn toggle-content" id="eventsContent" data-content-link="home/events">Events</button>
                    <button class="btn toggle-content" id="formsContent" data-content-link="home/forms">Forms</button>
                    <button class="btn toggle-content" id="listsContent" data-content-link="home/lists">Lists</button>
                    <!--<button class="btn toggle-content" id="reportsContent" data-content-link="home/lists">Reports</button>-->
                    <div class="trash">
                        <button class="btn toggle-content" id="reportsContent" data-content-link="home/reports">Inactive Events</button>
                    </div>
                </div>
            </div>
            <div class="main-content">
                <div class="item-container events-content"></div>
                <div class="item-container forms-content"></div>
                <div class="item-container lists-content"></div>
                <div class="item-container reports-content"></div>
            </div>
        </div>

        <?php include 'Partials/hidden.php'; ?>

        <?php include 'Imports/bottom.php'; ?>
    </body>

</html>