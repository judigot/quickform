//========================================EVENT MODULE========================================//

//====================GLOBAL VARIABLES====================//
var event_type;
var event_isSubjectNotEdted = true;
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    $(".timepicker").timepicker({
        minuteStep: 1
    });
    // View event
    $(document).on("dblclick", ".item-event", function (e) {
        window.open("event/" + $(this).attr("data-item-id"), "_blank");
    });
    // View report
    $(document).on("dblclick", ".item-report", function (e) {
        window.open("event/" + $(this).attr("data-item-id"), "_blank");
    });
    // Generate event
    $(document).on("click", "#generateEvent", function (e) {
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "json",
            data: {
                read: "formAndListDropdown"
            }
        }).done(function (data) {
            var formResult = data[0];
            var listResult = data[1];
            $(".form-previewer").show();
            $(".form-dropdown, #list-dropdown").empty().css({"background-color": "transparent"}).removeAttr("disabled");
            if (formResult.length === 0) {
                $(".form-previewer").hide();
                $(".form-dropdown").append('<option value="null" hidden>No forms</option>').css({"background-color": "#F0817B"}).attr("disabled", "true");
            } else {
                for (var i = 0; i < formResult.length; i++) {
                    // Append form options
                    $(".form-dropdown").append('<option class="form-option" value="' + formResult[i]["form_id"] + '">' + formResult[i]["form_name"] + '</option>');
                }
            }
            if (listResult.length === 0) {
                $("#listPreview").hide();
                $("#list-dropdown").append('<option value="null" hidden>No lists</option>').css({"background-color": "#F0817B"}).attr("disabled", "true");
            } else {
                for (var i = 0; i < listResult.length; i++) {
                    // Append list options
                    $("#list-dropdown").append('<option class="list-option" value="' + listResult[i]["list_id"] + '">' + listResult[i]["list_name"] + '</option>');
                }
            }
        }).fail(function (data) {
        });
        $("#regEventForm").modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#regEventTitle").focus();
        $("#regEventTitle, #regEventPassword").val("");
        $("#confirmRegEvent, #regInfoContainer").hide();
        $("#regDay").children("option[value='29'], option[value='30'], option[value='31']").show();
    });
    $(document).on("input", "#regFormBody", function (e) {
        event_validateDate();
        if ($("#regEventTitle").val()) {
            event_toggleItems();
            $("#regInfoContainer").fadeIn(100);
        } else {
            $("#confirmRegEvent, #regInfoContainer").fadeOut(100);
        }
    });
    $(document).on("change", "#regMonth, #regYear", function (e) {
        event_validateDate();
    });
    $(document).on("click", "#passVisibility", function (e) {
        var newType = $("#regEventPassword").attr("type") === "text" ? "password" : "text";
        $("#regEventPassword").attr("type", newType);
        $("#regEventPassword").attr("type") === "text" ? $(this).removeClass("fa-eye") : $(this).removeClass("fa-eye-slash");
        $("#regEventPassword").attr("type") === "text" ? $(this).addClass("fa-eye-slash") : $(this).addClass("fa-eye");
        $("#regEventPassword").attr("type") === "text" ? $(this).attr("data-original-title", "Hide password") : $(this).attr("data-original-title", "Show password");
    });
    $(document).on("click", ".form-previewer", function (e) {
        var form;
        var formId;
        if ($(this).hasClass("reg-form-preview")) {
            formId = $(".reg-dropdown").val();
        }
        if ($(this).hasClass("special-form-preview")) {
            formId = $(".special-form-dropdown").val();
        }
        form = $(".forms-content").find("[data-item-id='" + formId + "']");
        form_viewForm(form, "view");
    });
    $(document).on("click", "#listPreview", function (e) {
        window.open("list/" + $("#list-dropdown").val(), "_blank");
    });
    $(document).on("click", "#createEventTrigger", function (e) {
        $("#newEvent").modal("hide");
    });
    $(document).on("change", "#listInput, #emailNotification", function (e) {
        event_toggleItems();
    });
    $(document).on("change", "#regStartTime, #regEndTime", function (e) {
        event_toggleItems();
    });
    $(document).on("click", "#editEmailTrigger", function (e) {
        $("#emailContent").modal({
            backdrop: 'static',
            keyboard: false
        });
        if (event_isSubjectNotEdted) {
            $("#emailSubject").val($("#regEventTitle").val());
            event_isSubjectNotEdted = false;
        }
        $("#emailSubject").focus();
    });
    $(document).on("keydown", "#emailBody", function (e) {
        if (e.keyCode === 9) {
            e.preventDefault();
//            $.notify("Tab", "danger");
        }
    });
    $(document).on("click", "#confirmEmailContent", function (e) {
//        $.notify("Subject: " + $("#emailSubject").val(), "danger");
//        $.notify("Body: " + $("#emailBody").text(), "danger");
    });
    $(document).on("click", "#confirmRegEvent", function (e) {
        var eventName = $("#regEventTitle").val();
        var password = $("#regEventPassword").val() ? $("#regEventPassword").val() : null;
        var date = $("#regYear").val() + "-" + $("#regMonth").val() + "-" + $("#regDay").val();
        var startTime = date + " " + event_12to24($("#regStartTime").val());
        var endTime = date + " " + event_12to24($("#regEndTime").val());

        var data;
        var form = null;
        var emailContent = null;
        var list = null;
        var specialForm = null;
        if (event_type === "registration") {
            form = $(".reg-dropdown").val();
        } else {
            list = $("#list-dropdown").val();
            if ($("#emailNotification").is(":checked")) {
                emailContent = [{
                        subject: $("#emailSubject").val(),
                        body: $("#emailBody").text()
                    }];
                emailContent = JSON.stringify(emailContent);
            }
            specialForm = $(".special-form-dropdown").val();
        }
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "text",
            data: {
                create: "insertEvent",
                data: {
                    type: event_type,
                    eventName: eventName,
                    password: password,
                    form: form,
                    list: list,
                    email: emailContent,
                    specialForm: specialForm,
                    startTime: startTime,
                    endTime: endTime
                }
            }
        }).done(function (data) {
            home_loadEventData("checkOngoingEventUpdates");
        }).fail(function (data) {
        });
    });
});
//====================GENERAL====================//
//====================FUNCTIONS====================//
function event_validateDate() {
    var month = $("#regMonth").val();
    var year = $("#regYear").val() / 4;
    var thirtyMonths = ["02", "04", "06", "09", "11"];

    $("#regDay").children("option[value='29'], option[value='30'], option[value='31']").show();
    if (thirtyMonths.includes(month)) {
        if (month === "02") {
            var febLast;
            if (Number.isInteger(year)) {
                // February leap
                febLast = 29;
                $("#regDay").children("option[value='30'], option[value='31']").hide();
            } else {
                febLast = 28;
                $("#regDay").children("option[value='29'], option[value='30'], option[value='31']").hide();
            }
            if ($("#regDay").val() > febLast) {
                $("#regDay").val(febLast);
            }
        } else {
            if ($("#regDay").val() > 30) {
                $("#regDay").val("30");
            }
            $("#regDay").children("option[value='31']").hide();
        }
    }
}
function event_12to24(time) {
    var position;
    if (time.search("a") !== -1 || time.search("A") !== -1) {
        position = time.search("a") !== -1 ? time.search("a") : time.search("A");
    } else if (time.search("p") !== -1 || time.search("P") !== -1) {
        position = time.search("p") !== -1 ? time.search("p") : time.search("P");
    }
    if (time[position - 1] !== " ") {
        time = time.substring(0, position) + " " + time.substring(position);
    }
    var hour = Number(time.match(/^(\d+)/)[1]);
    var minute = Number(time.match(/:(\d+)/)[1]);
    var period = time.match(/\s(.*)$/)[1];
    if ((period === "am" || period === "AM") && hour === 12) {
        hour = hour - 12;
    }
    if ((period === "pm" || period === "PM") && hour < 12) {
        hour = hour + 12;
    }
    var sHours = hour.toString();
    var sMinutes = minute.toString();
    if (hour < 10) {
        sHours = "0" + sHours;
    }
    if (minute < 10) {
        sMinutes = "0" + sMinutes;
    }
    return sHours + ":" + sMinutes + ":00";
}
function event_toggleItems() {
    if ($("#regEventPassword").val()) {
        $("#passVisibility").show();
    } else {
        $("#passVisibility").hide();
    }
    if ($("#listInput").is(":checked")) {
        event_type = "attendance";
        $("#eventTypeLabel").text("Attendance");
        $("#attEventOptionsContainer").show();
        $("#regFormOptionContainer").hide();
    } else {
        event_type = "registration";
        $("#eventTypeLabel").text("Registration");
        $("#attEventOptionsContainer").hide();
        $("#regFormOptionContainer").show();
    }
    if ($("#emailNotification").is(":checked")) {
        $("#editEmailTrigger").show();
    } else {
        $("#editEmailTrigger").hide();
    }
    if ($("#regEventTitle").val() && $("#regMonth").val() !== "null" && $("#regDay").val() !== "null" && $("#regYear").val() !== "null" && $("#regStartTime").val() && $("#regEndTime").val()) {
        $("#confirmRegEvent").hide();
        if (event_type === "registration" && $(".reg-dropdown").val() !== "null") {
            $("#confirmRegEvent").show();
        }
        if (event_type === "attendance" && $("#list-dropdown").val() !== "null" && $(".special-form-dropdown").val() !== "null") {
            $("#confirmRegEvent").show();
        }
    }
}
//====================FUNCTIONS====================//

//========================================EVENT MODULE========================================//