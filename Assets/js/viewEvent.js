//========================================EVENT MODULE========================================//

//====================GLOBAL VARIABLES====================//
var evt_clock;
var evt_current = $("body").attr("data-current-time");
var evt_start = $("[data-start-time]").attr("data-start-time");
var evt_end = $("[data-end-time]").attr("data-end-time");
var evt_status;
var evt_remainingTime = Date.parse(evt_start) / 1000 - Date.parse(evt_current) / 1000;
var evt_endTimer;
var evt_hasEnded = false;
var evt_eventDataResult;
var evt_eventDataResultHash;
var evt_eventInfoUpdatesInterval = 1000;
var evt_mainTable;
var evt_activePage = "1";
var evt_activeRows = [];
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    document.title = $("body").attr("data-event-name") + " - Quickform";
    $(document).on("click", "#downloadReport", function (e) {
        const eventID = this.dataset.eventId;
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "json",
            data: {
                eventID: eventID,
            }
        }).done(function (data) {
            //====================DOWNLOAD FILE====================//
            // Download file in javascript (client side):
            if(data) {
                const fileName = `Quickreport - ${data.eventName}`;
                const fileExtension = "csv";
                const rows = data.data;
                let fileContent = `data:text/${fileExtension};charset=utf-8,`;
                switch (fileExtension) {
                case "csv":
                    fileContent += rows
                    .map((array) =>
                        array
                        .map((value) => {
                            return `"${value.replace(/"/g, `""`)}"`;
                        })
                        .join(",")
                    )
                    .join("\n");
                    break;
                default:
                    break;
                }
                const encodedURI = encodeURI(fileContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedURI);
                link.setAttribute("download", `${fileName}.${fileExtension}`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
            //====================DOWNLOAD FILE====================//
        }).fail(function (data) {
            alert("Error downloading file");
        });
    });
    $("[name=maxColumnCount]").attr("value", $("#attendanceTable").attr("data-max-col"));
    if (location.href.substr(location.href.lastIndexOf('/') + 1) !== $("body").attr("data-event-name").replace(/\s/g, "-")) {
        window.history.replaceState({}, "", "event/" + $("body").attr("data-event-id") + "/" + $("body").attr("data-event-name").replace(/\s/g, "-").toLowerCase());
    }
    if (Date.parse(evt_current) < Date.parse(evt_start)) {
        loadFlipClock();
        $("body").animate({
            "background-color": "black"
        }, 500);
        $(document).on("click", ".flip-clock-wrapper", function (e) {
            e.preventDefault();
        });
        setTimeout(function () {
            var timestamp = $("body").attr("data-start-time");
            var unix = new Date(timestamp.replace(' ', 'T')).getTime();
            $.notify("Event starts at " + $("body").attr("data-start-time") + ".", {
                className: "danger",
                position: "bottom left"
            });
        }, 1000);
    } else {
        if ($("#eventMain").attr("data-event-password") === "true") {
            $(".event-label").hide();
            $("#password").focus();
            $("#eventMain").hide();
        } else {
            if ($("body").attr("data-event-type") === "attendance") {
                evt_loadTable();
            }
        }
    }
    $(document).on("click", "#verify-pass-button", function (e) {
        if ($("#password").val()) {
            $("#password").css({"background-color": "white"});
            $("#password, #verify-pass-button").attr("disabled", "true");
            $("#verify-pass-button").hide();
            $("#login-result").text("");
            $("#login-result").append("<img class='preloader' style='zoom: 50%;' src='Assets/images/preloaders/1.gif' alt='Loading...'>");
            eventFilter();
        }
    });
    $(document).on("keydown", function (e) {
        if (e.keyCode === 13 && $("#password").val()) {
            $("#verify-pass-button").trigger("click");
        }
    });
    //====================TIME FIELD====================//
    $(document).on("keydown", ".time-input", function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    });
    $(document).on("click", ".time-input", function (e) {
        e.preventDefault();
        var currentSwitch = $(this);
        var rowIndex = $(this).closest("td").attr("data-row-index");
        var columnIndex = $(this).closest("td").attr("data-column-index");
        var time;
        var timeType;
        if (!currentSwitch.closest(".time").attr("data-signed-in")) {
            timeType = "in";
        } else {
            timeType = "out";
        }
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "json",
            data: {
                update: "updateEventData",
                data: {
                    timeType: timeType,
                    tableName: $("body").attr("data-event-id"),
                    rowIndex: rowIndex,
                    columnIndex: columnIndex
                }
            }
        }).done(function (data) {
            evt_eventInfoUpdates();
        }).fail(function (data) {});
        currentSwitch.closest(".time").css({
            "pointer-events": "none"
        });
    });
    //====================TIME FIELD====================//
    $(document).on("click", ".paginate_button:not(.disabled)", function (e) {
        var current = $(this).text();
        if (current !== evt_activePage) {
            evt_activePage = current;
            $(".preloader").show();
        }
    });
    $(document).on("change", "select[name]", function (e) {
        evt_assignRowIndex();
    });
    $(document).on("click", ".attendance-action", function (e) {
        $(".tooltip").fadeOut(100);
    });
    $(document).on("click", ".end-event", function (e) {
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "json",
            data: {
                update: "forceEndEvent",
                data: {
                    eventId: $("body").attr("data-event-id")
                }
            }
        }).done(function (data) {
        }).fail(function (data) {
        });
        $.notify("Event forced to end.", "danger");
    });
    $(document).on("click", ".event-status-toggle", function (e) {
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "text",
            data: {
                update: "toggleEventStatus",
                data: {
                    eventId: $("body").attr("data-event-id")
                }
            }
        }).done(function (data) {
        }).fail(function (data) {
        });
    });
});
//====================GENERAL====================//

//====================FUNCTIONS====================//
function evt_loadTable() {
    //=====AD=====//
    var adTypes = ["jpg", "png", "gif"];
    var adType = adTypes[Math.floor(Math.random() * adTypes.length)];
    if (adType === "jpg") {
        var fileName = [1, 2, 3, 4, 5];
        $("#adContainer").append("<img src='Assets/images/banners/" + fileName[Math.floor(Math.random() * fileName.length)] + ".jpg'>");
    } else if (adType === "png") {
        var fileName = [1, 2, 3, 4, 5];
        $("#adContainer").append("<img src='Assets/images/banners/" + fileName[Math.floor(Math.random() * fileName.length)] + ".jpg'>");
    }
    if (adType === "gif") {
        var fileName = [1];
        $("#adContainer").append("<img src='Assets/images/banners/" + fileName[Math.floor(Math.random() * fileName.length)] + ".gif'>");
    }
    //=====AD=====//
    if ($("body").attr("data-event-status") === "active" && $("body").attr("data-event-type") === "attendance") {
        $("body").append("<img class='preloader' style='zoom: 50%;' src='Assets/images/preloaders/1.gif' alt='Loading...'>");
    }
    evt_mainTable = $("#attendanceTable").DataTable({
        "lengthMenu": [[5, 10, 20], ["5", "10", "20"]],
        "ordering": false,
        "pagingType": "full",
        "serverSide": true,
        "ajax": {
            url: "Classes/server_processing.php",
            "type": "POST",
            data: {
                "eventId": $("body").attr("data-event-id"),
                "eventName": $("body").attr("data-event-name"),
                "eventList": $("table").attr("data-event-list"),
                "maxColumnCount": $("table").attr("data-max-col"),
                "columnNames": $("table").attr("data-col-names"),
                "listResult": $("table").attr("data-list-result"),
                "specialForm": $("table").attr("data-special-form")
            }
        },
        "initComplete": function () {
            evt_mainTable.on("draw", function (e) {
                evt_assignRowIndex();
                evt_eventInfoUpdates(evt_eventDataResult);
                $(".preloader").hide();
            });
            $(".preloader").hide();
            evt_assignRowIndex();
            evt_eventInfoUpdates();
            evt_endTimer = setInterval(function () {
                evt_eventInfoUpdates();
            }, evt_eventInfoUpdatesInterval);
        }
    });
}
function evt_assignRowIndex() {
    evt_activeRows.length = 0;
    $(".special-field").each(function () {
        var columnIndex = parseInt($(this).attr("data-column-index"));
        $(this).closest("td").attr("data-column-index", columnIndex).attr("data-row-index", parseInt($(this).attr("data-row-index")) - 1);
        evt_activeRows.push((parseInt($(this).attr("data-row-index")) - 1));
    });
}
function evt_viewForm() {
    var formContent = JSON.parse($("body").attr("data-special-form-content"));
    for (var i = 0; i < $("tbody").children("tr").length; i++) {
        for (var j = 0; j < formContent.length; j++) {
            var title = formContent[j].title.toUpperCase();
            var type = formContent[j].type;
            var currentRow = $("tbody").children("tr").eq(i);
            switch (type) {
                case "text":
                    currentRow.append("<td>" + $(".fieldSource").children(".textInput")[0].outerHTML + "</td>");
                    formContent[j].maxLength !== null ? currentRow.children("td").last().children(".textInput").attr("maxlength", formContent[j].maxLength) : false;
                    break;
                case "number":
                    currentRow.append("<td>" + $(".fieldSource").children(".numberInput")[0].outerHTML + "</td>");
                    formContent[j].minVal !== null ? currentRow.children("td").last().children(".numberInput").attr("min", formContent[j].minVal) : false;
                    formContent[j].maxVal !== null ? currentRow.children("td").last().children(".numberInput").attr("max", formContent[j].maxVal) : false;
                    break;
                case "boolean":
                    currentRow.append("<td>" + $(".fieldSource").children(".boolean")[0].outerHTML + "</td>");
                    currentRow.children("td").last().find(".booleanInput").prop("checked", JSON.parse(formContent[j].default));
                    break;
                case "dropdown":
                    currentRow.append("<td>" + $(".fieldSource").children(".dropdown")[0].outerHTML + "</td>");
                    var values = formContent[j].values["options"];
                    for (var k = 0; k < values.length; k++) {
                        currentRow.children("td").last().children(".dropdown").append("<option>" + values[k] + "</option>");
                    }
                    currentRow.children("td").last().children(".dropdown").val(formContent[j].default);
                    break;
                case "time":
                    currentRow.append("<td>" + $(".fieldSource").children(".time")[0].outerHTML + "</td>");
                    break;
            }
            currentRow.children("td").last().attr("data-row-index", i + 1).attr("data-column-index", j + 1);
        }
    }
}
function evt_eventInfoUpdates() {
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "json",
        data: {
            read: "checkActiveEventUpdates",
            data: {
                eventId: $("body").attr("data-event-id"),
                eventStart: evt_start,
                activeRows: evt_activeRows.toString()
            }
        }
    }).done(function (data) {
        var currentTime = data[0];
        var keys = Object.keys(data[3][0]);
        var start = data[3][0][keys[0]];
        var end = data[3][0][keys[1]];
        evt_status = data[3][0][keys[2]];

        // Event starts
        if (Date.parse(start) < Date.parse(currentTime)) {
            var hash = data[1];
            var result = data[2];
            if (evt_eventDataResult !== hash) {
                evt_eventDataResult = hash;
                evt_eventDataResult = result;
                evt_updateEventData(result);
            }
        }
        // Event ends
        if (Date.parse(end) < Date.parse(currentTime)) {
            var newStatus = (evt_status === "active" ? "in" : "") + "active";
            if ($(".event-status-toggle").length === 0) {
                $('.actions-container').append("<button type='button' title='Mark event as " + newStatus + "' data-event-status='' class='action-children attendance-action event-status-toggle'><i class='fa fa-check-circle'></i></button>");
            }
            $(".event-status-toggle").attr("data-event-status", newStatus).attr("data-original-title", "Mark event as " + newStatus);
            $(".attendance-action").attr("data-placement", "bottom").tooltip();
            $("td").find(".time").each(function () {
                if ($(this).attr("data-signed-in") && !$(this).attr("data-signed-out")) {
                    $(this).css({
                        "pointer-events": "auto"
                    });
                } else {
                    $(this).css({
                        "pointer-events": "none"
                    });
                }
            });
            if (!evt_hasEnded) {
                $.notify($("[data-event-name]").attr("data-event-name") + " has ended.", {
                    className: "danger",
                    position: "bottom left"
                });
            }
            evt_hasEnded = true;
        }
    }).fail(function (data) {
    });
}
function evt_updateEventData(result) {
    var dataKeys = [];
    var formContent = $("body").attr("data-special-form-content");
    var formContentLength = JSON.parse(formContent).length;
    for (var i = 0; i < formContentLength; i++) {
        for (var x in result[i]) {
            dataKeys.push(x);
        }
    }
    for (var i = 0; i < result.length; i++) {
        var currentSwitch = $('[data-row-index="' + result[i]["row_id"] + '"]').find(".time");
        for (var j = 0; j < dataKeys.length; j++) {
            if (j !== 0 && result[i][dataKeys[j]]) {
                var timeInfo = JSON.parse(result[i][dataKeys[j]]);
                currentSwitch.closest(".time").css({
                    "pointer-events": "none"
                });
                if (timeInfo.length === 1) {
                    var timeIn = timeInfo[0]["in"];
                    currentSwitch.closest(".time").attr("data-signed-in", "true");
                    currentSwitch.children(".time-input").prop("checked", true);
                    currentSwitch.closest(".time").addClass("rotate180");
                    currentSwitch.children(".time-switch").addClass("signed-out");
                    if (!currentSwitch.closest("td").children(".time-in").length) {
                        currentSwitch.closest("td").append('<span class="time-data time-in">In:&nbsp' + timeIn + '</span>').children().last().hide().show(100);
                    }
                }
                if (timeInfo.length === 2) {
                    var timeIn = timeInfo[0]["in"];
                    var timeOut = timeInfo[1]["out"];
                    currentSwitch.closest(".time").attr("data-signed-out", "true");
                    currentSwitch.children(".time-input").prop("checked", false);
                    currentSwitch.closest(".time").addClass("rotate180");
                    currentSwitch.children(".time-switch").addClass("signed-out");
                    if (!currentSwitch.closest("td").children(".time-in").length) {
                        currentSwitch.closest("td").append('<span class="time-data time-in">In:&nbsp' + timeIn + '</span>').children().last().hide().show(100);
                    }
                    if (!currentSwitch.closest("td").children(".time-out").length) {
                        currentSwitch.closest("td").append('<span class="time-data time-out">Out:&nbsp' + timeOut + '</span>').children().last().hide().show(100);
                    }
                }

            }
        }
    }
}
function eventFilter() {
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "text",
        data: {
            eventFilter: "",
            data: {
                eventId: $("body").attr("data-event-id"),
                password: $("#password").val()
            }
        }
    }).done(function (data) {
        $(".preloader").hide();
        if (data === "0") {
            setTimeout(function () {
                $(".event-label").show("drop", {
                    direction: "up"
                }, 100);
            }, 500);
            $("#login-result").text("");
            $("#modal-backdrop").remove();
            $("#eventMain").fadeIn(1000);
            $('link[rel=stylesheet][href~="Assets/css/viewEventPass.css"]').remove();
            if ($("body").attr("data-event-type") === "attendance") {
                evt_loadTable();
            }
        } else {
            $("#login-result").text("The password that you entered is incorrect.");
            $("#password").css({"background-color": "#F0817B"});
            $("#password, #verify-pass-button").removeAttr("disabled");
            $("#verify-pass-button").show();
            $("#password").focus();
        }
    }).fail(function (data) {
    });
}
function loadFlipClock() {
    evt_clock = $('.clock').FlipClock(evt_remainingTime, {
        clockFace: 'DailyCounter',
        countdown: true,
        callbacks: {
            stop: function () {
                setTimeout(function () {
                    // If the event starts
                    window.location.reload();
                }, 2000);
            }
        }
    });
}
//====================FUNCTIONS====================//

//========================================EVENT MODULE========================================//
