<?php require_once 'Imports/preload.php'; ?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <?php require_once 'Imports/top.php'; ?>
        <link href="Assets/css/gettingStarted.css" rel="stylesheet" type="text/css"/>
        <script src="Assets/js/login.js" type="text/javascript"></script>
    </head>

    <body id="login-body">
        <div id="modal-backdrop">
            <div id="modal-body">
                <div id="form-body">
                    <a href="index"><img class="quickform-nav" src="Assets/images/quickhome.png" alt="Mountain View"></a>
                    <span id="first-name"></span>
                    <div>
                        <input id="email" class="field" type="email" placeholder="Email"<?php echo isset($_SESSION["userEmail"]) ? " value=\"{$_SESSION["userEmail"]}\"" : false; ?>>
                        <input id="password" class="field" type="password" placeholder="Password">
                        <div id="login-result"></div>
                        <button class="btn submit-button" id="login-button">LOG IN</button>
                        <br><br>
                        <span>If you don't have an account then <a href="signup" type="button">sign up</a>.</span>
                    </div>
                </div>
            </div>
        </div>
        <?php require_once 'Imports/bottom.php'; ?>
    </body>

</html>