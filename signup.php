<?php require_once 'Imports/preload.php'; ?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <?php require_once 'Imports/top.php'; ?>
        <link href="Assets/css/gettingStarted.css" rel="stylesheet" type="text/css"/>
        <script src="Assets/js/signup.js" type="text/javascript"></script>
    </head>

    <body id="signup-body">
        <div id="modal-backdrop">
            <div id="modal-body">
                <div id="form-body">
                    <a href="index"><img class="quickform-nav" src="Assets/images/quickhome.png" alt="Mountain View"></a>
                    <br><br>
                    <div>
                        <input type="text" id="firstName" placeholder="First name" class="field capitalize">
                        <input type="text" id="lastName" placeholder="Last name" class="field capitalize">
                        <input type="email" id="email" placeholder="Email"class="field">
                        <input type="password" id="password" placeholder="Password" class="field">
                        <input type="password" id="confirmPassword" placeholder="Confirm password" class="field">
                        <div id="login-result">&nbsp;</div>
                        <button id="signup-button" class="btn submit-button">SIGN UP</button>
                        <br><br>
                        <span>If you already have an account then <a href="login" id="login-button">log in</a>.</span>
                    </div>
                </div>
            </div>
        </div>
        <?php require_once 'Imports/bottom.php'; ?>   
    </body>

</html>


