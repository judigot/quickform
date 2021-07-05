//========================================LOG IN MODULE========================================//

//====================GLOBAL VARIABLES====================//
var signup_titleInterval;
var signup_titleTimeout;
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    $("#firstName").focus();
    $(document).on("click", "#signup-button", function (e) {
        signup_confirmUser();
    });
    $(document).on("keydown", function (e) {
        if (e.keyCode === 13) {
            signup_confirmUser();
        }
    });
    $(document).ajaxStart(function () {
        $("#password, #email").css({"background-color": "white"});
        $("input").attr("disabled", "true");
        $(".btn").hide();
        $("#login-result").text("");
        $("#login-result").append("<img style='zoom: 50%;' src='Assets/images/preloaders/1.gif' alt='Loading...'>");
    });
    $(document).on("input", "input", function (e) {
        if ($(this).val()) {
            $(this).css({"background-color": "white"});
        } else {
            $(this).css({"background-color": "#F0817B"});
        }
    });
});
//====================GENERAL====================//

//====================FUNCTIONS====================//
function signup_confirmUser() {
    clearInterval(signup_titleInterval);
    clearTimeout(signup_titleTimeout);
    if ($("#firstName").val() && $("#lastName").val() && $("#email").val() && $("#password").val() && $("#confirmPassword").val()) {
        if ($("#password").val() === $("#confirmPassword").val()) {
            $("#login-result").text("");
            $("input").css({"background-color": "white"});
            $.ajax({
                url: "Classes/process.php",
                type: "POST",
                dataType: "json",
                data: {
                    create: "insertUser",
                    data: {
                        firstName: $("#firstName").val(),
                        lastName: $("#lastName").val(),
                        email: $("#email").val(),
                        password: $("#password").val(),
                        confirmPassword: $("#confirmPassword").val()
                    }
                }
            }).done(function (data) {
                if (data[0] === 0) {
                    window.location.replace("login");
                } else if (data[0] === 1) {
                    document.title = "Email already taken - Quickform";
                    $("#login-result").text("The email address that you entered has already been used.");
                    $("#first-name").text("Hello, " + data[0] + "!");
                    $("input").removeAttr("disabled");
                    $(".btn").show();
                    signup_titleInterval = setInterval(function () {
                        if (document.title !== "Email already taken - Quickform") {
                            document.title = "Email already taken - Quickform";
                        } else {
                            document.title = "Sign up for Quickform - Quickform";
                        }
                    }, 1000);
                    signup_titleTimeout = setTimeout(function () {
                        clearInterval(signup_titleInterval);
                    }, 10000);
                    $("#email").focus();
                }
                setTimeout(function () {
                    $("#password, #email").css({"background-color": "white"});
                }, 5000);
            }).fail(function (data) {
                $("#login-result").text("There was an error occured.");
                $("#password").focus();
                $("input").removeAttr("disabled");
                $(".btn").show();
            });
        } else {
            $("#login-result").text("The passwords that you've entered do not match.");
            document.title = "Passwords do not match - Quickform";
            signup_titleInterval = setInterval(function () {
                if (document.title !== "Passwords do not match - Quickform") {
                    document.title = "Passwords do not match - Quickform";
                } else {
                    document.title = "Sign up for Quickform - Quickform";
                }
            }, 1000);
        }
    } else {
        $("#login-result").text("Please fill up all the fields.");
        $("input").each(function () {
            if ($(this).val()) {
                $(this).css({"background-color": "white"});
            } else {
                $(this).css({"background-color": "#F0817B"});
            }
        });
    }
}
//====================FUNCTIONS====================//

//========================================LOG IN MODULE========================================//