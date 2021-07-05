//========================================MODULE/APP NAME========================================//

//====================GLOBAL VARIABLES====================//
var vr_values = [];
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    $(document).on("click", "#submitData", function (e) {
        vr_values.length = 0;
        if (!$(this).hasClass("submitted")) {
            for (var i = 0; i < $(".fieldContainer").length; i++) {
                if (!$("#" + (i + 1).toString()).hasClass("booleanInput")) {
                    $("#" + (i + 1).toString()).val() ? vr_values.push($("#" + (i + 1).toString()).val()) : false;
                } else {
                    var value = $("#" + (i + 1)).is(":checked") ? "true" : "false";
                    vr_values.push(value);
                }
            }
        }
        if (vr_values.length === $(".fieldContainer").length) {
            $(this).addClass("submitted").css({"pointer-events": "none"});
            $.ajax({
                url: "Classes/process.php",
                type: "POST",
                dataType: "text",
                data: {
                    create: "insertRegistrationValues",
                    data: {
                        table: $("#preregistrationContainer").attr("data-list-id"),
                        values: JSON.stringify(vr_values)
                    }
                }
            }).done(function (data) {
                if (!$(".notifyjs-wrapper").is(":visible")) {
                    $.notify("Your have successfully registered.", {
                        className: "danger",
                        position: "bottom left"
                    });
                }
            }).fail(function (data) {
            });
        } else {
            if (!$(".notifyjs-wrapper").is(":visible")) {
                $.notify("Please fill up all the fields.", {
                    className: "danger",
                    position: "bottom left"
                });
            }
        }
    });
});
//====================GENERAL====================//

//====================FUNCTIONS====================//
//====================FUNCTIONS====================//

//========================================MODULE/APP NAME========================================//