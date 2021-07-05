//========================================LOG IN MODULE========================================//

//====================GLOBAL VARIABLES====================//
var login_titleInterval;
var login_titleTimeout;
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    $("#email").focus();
    $(document).on("click", "#login-button", function (e) {
        login_filter();
    });
    $(document).on("keydown", function (e) {
        if (e.keyCode === 13) {
            if (/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#email").val())) {
                login_filter();
            } else {
                $("#login-result").text("Please provide a valid email address.");
                $("#email").css({"background-color": "#F0817B"});
                clearTimeout(login_titleTimeout);
                login_titleTimeout = setTimeout(function () {
                    $("input").css({"background-color": "white"});
                }, 5000);
            }
        }
    });
    $(document).ajaxStart(function () {
        $("input").css({"background-color": "white"});
        $("input").attr("disabled", "true");
        $(".btn").hide();
        $("#login-result").text("");
        $("#login-result").append("<img style='zoom: 50%;' src='Assets/images/preloaders/1.gif' alt='Loading...'>");
    });
});
//====================GENERAL====================//

//====================FUNCTIONS====================//
function login_filter() {
    clearInterval(login_titleInterval);
    clearTimeout(login_titleTimeout);
    if ($("#email").val() && $("#password").val()) {
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "json",
            data: {
                loginFilter: "",
                data: {email: $("#email").val(), password: $("#password").val()}
            }
        }).done(function (data) {
            if (data[0] === 0) {
                $("body").fadeOut(500);
                setTimeout(function () {
                    window.location.replace("home/events");
                }, 500);
            } else if (data[0] === 1) {
                document.title = "Incorrect password! - Quickform";
                $("#login-result").text("The password that you entered is incorrect.");
                $("#first-name").text("Hello, " + data[1]);
                $("input").removeAttr("disabled");
                $(".btn").show();
                $("#password").css({"background-color": "#F0817B"});
                login_titleInterval = setInterval(function () {
                    if (document.title !== "Incorrect password! - Quickform") {
                        document.title = "Incorrect password! - Quickform";
                    } else {
                        document.title = "Log in to Quickform - Quickform";
                    }
                }, 1000);
                login_titleTimeout = setTimeout(function () {
                    clearInterval(login_titleInterval);
                }, 10000);
                $("#password").focus();
            } else if (data[0] === "nodata") {
                document.title = "Nonexistent email address! - Quickform";
                $("#login-result").text("The email address that you entered did not match any account.");
                $("#first-name").text("");
                $("input").removeAttr("disabled");
                $(".btn").show();
                $("#email").css({"background-color": "#F0817B"});
                login_titleInterval = setInterval(function () {
                    if (document.title !== "Nonexistent email address! - Quickform") {
                        document.title = "Nonexistent email address! - Quickform";
                    } else {
                        document.title = "Log in to Quickform - Quickform";
                    }
                }, 1000);
                login_titleTimeout = setTimeout(function () {
                    clearInterval(login_titleInterval);
                }, 10000);
                $("#email").focus();
            }
            setTimeout(function () {
                $("input").css({"background-color": "white"});
            }, 5000);
        }).fail(function (data) {
            $("#login-result").text("There was an error occured.");
            $("#password").focus();
            $("input").removeAttr("disabled");
            $(".btn").show();
        });
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