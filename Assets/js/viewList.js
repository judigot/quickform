//========================================MODULE/APP NAME========================================//

//====================GLOBAL VARIABLES====================//
var vl_tableName;
var vl_info = [];
var vl_autoUpdateInverval = 1000;
var vl_listContentAutoUpdate;
var vl_updateCellTimeout;
var vl_selectedCell;
var vl_updated;
var vl_listContent;
var vl_isPaused = false;
var vl_columnOrder = [];
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    if ($(".content").attr("data-create-list") === "true") {
        setTimeout(function () {
            $("#instruction").modal({
                backdrop: 'static',
                keyboard: false
            });
        }, 1000);
    }
    $(".list-info").hide();

    $("table").sorttable({
        helperCells: null
    });

    $("th").each(function () {
        vl_columnOrder.push($(this).attr("id"));
    });

    $(document).on("mouseup", "th", function (e) {
        setTimeout(function () {
            var newOrder = [];
            $("th").each(function () {
                newOrder.push($(this).attr("id"));
            });
            if (vl_columnOrder.toString() !== newOrder.toString()) {
                $(".update-progress").text("Saving...");
                vl_columnOrder.length = 0;
                vl_columnOrder = newOrder.slice();
                $.ajax({
                    url: "Classes/process.php",
                    type: "POST",
                    dataType: "text",
                    data: {
                        update: "rearrangeColumns",
                        data: {tableName: vl_tableName, columns: JSON.stringify(vl_columnOrder)}
                    }
                }).done(function (data) {
                    vl_saved();
                    var headers = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                    for (var i = 0; i < $("th").length; i++) {
                        $("th").eq(i).text(headers[i]).hide().show(1000);
                    }
                }).fail(function (data) {
                    vl_error();
                });
            }
        }, 0);
    });

    vl_tableName = $(".content").attr("data-list-id");

    if ($(".list-name").text() !== "" && $("table").is(":visible")) {
        if (location.href.substr(location.href.lastIndexOf('/') + 1) !== $(".list-name").text().replace(" ", "-")) {
            vl_info = ["list/" + vl_tableName + "/" + $(".list-name").text().replace(/\s/g, "-").toLowerCase()];
        }
        setTimeout(function () {
            $(".list-info").show(200).css({
                "position": "absolute"
            });
            $(".table-container").animate({
                "margin-top": "30px"
            }, 200);
        }, 500);
    } else if (!$(".list-name").text()) {
        vl_info = ["list/" + vl_tableName + "/list-not-found", "List does not exist.", "The list that you are looking for does not exist anymore. It may have been deleted or something."];
    } else {
        vl_info = ["list/" + vl_tableName + "/" + $(".list-name").text().replace(/\s/g, "-"), "Your list seems to be empty.", "The list may have been deleted or the format was incorrect."];
    }

    document.title = $(".list-name").text() ? $(".list-name").text() + " - " + document.title : "List not found - " + document.title;
    window.history.replaceState({}, "", vl_info[0]);
    if (vl_info[1] && vl_info[2]) {
        $(".list-error-title").text(vl_info[1]);
        $(".list-error-dscrptn").text(vl_info[2]);
    }
    if ($("input").length < 3000) {
        //==========Auto-update==========//
        vl_listContentAutoUpdate = setInterval(function () {
            if (!vl_info[1] && !vl_isPaused) {
                vl_updateTable();
            }
        }, vl_autoUpdateInverval);
        //==========Auto-update==========//
    }

    $(document).on("focus", "input", function (e) {
        vl_selectedCell = $(this);
    });

    $(document).on("input", "input", function (e) {
        vl_isPaused = true;
        vl_updated = false;
        $(".update-progress").text("Saving...");
        clearTimeout(vl_updateCellTimeout);
        vl_updateCellTimeout = setTimeout(function () {
            vl_updateCell();
            vl_isPaused = false;
        }, 500);
    });

    $(document).on("change", "input", function (e) {
        if (!vl_updated) {
            clearTimeout(vl_updateCellTimeout);
            vl_selectedCell = $(this);
            vl_updateCell();
            vl_isPaused = false;
        }
    });
});
//====================GENERAL====================//

//====================FUNCTIONS====================//
function vl_saved() {
    setTimeout(function () {
        $(".update-progress").text("All changes saved").hide().fadeIn(500);
        setTimeout(function () {
            $(".update-progress").append('&nbsp<i class="fa fa-check-circle" aria-hidden="true"></i>').find(".fa-check-circle").hide().fadeIn(1000);
        }, 500);
    }, 100);
}

function vl_error() {
    setTimeout(function () {
        $(".update-progress").text("There was an error saving your changes").hide().fadeIn(100);
        setTimeout(function () {
            $(".update-progress").append('&nbsp<i class="fa fa-exclamation-circle" aria-hidden="true"></i>').find(".fa-exclamation-circle").fadeIn(200);
        }, 200);
    }, 100);
}

function vl_updateTable() {
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "json",
        data: {
            read: "checkListDataUpdates",
            data: {
                listId: vl_tableName
            }
        }
    }).done(function (data) {
        var hash = data[0];
        var result = data[1];
        var keys = Object.keys(result[0]);
        var cell = 0;
        if (result.length) {
            if (vl_listContent !== hash) {
                vl_listContent = hash;
                for (var i in result) {
                    for (var j in keys) {
                        if (j !== "0") {
                            // Native
                            if (document.querySelectorAll("input[value]")[cell].value !== result[i][keys[j]]) {
                                document.querySelectorAll("input[value]")[cell].value = result[i][keys[j]];
                            }
                            // jQuery
//                            if ($("input[value]").eq(cell).val() !== result[i][keys[j]]) {
//                                $("input[value]").eq(cell).val(result[i][keys[j]]);
//                            }
                            cell++;
                        }
                    }
                }
            }
        } else {
        }
    }).fail(function (data) {});
}

function vl_updateCell() {
    vl_updated = true;
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "text",
        data: {
            update: "updateListData",
            data: {
                tableName: vl_tableName,
                newValue: vl_selectedCell.val(),
                row: vl_selectedCell.closest("tr").index() + 1,
                column: $("th").eq(vl_selectedCell.closest("td").index()).attr("id")
            }
        }
    }).done(function (data) {
        vl_saved();
    }).fail(function (data) {
        vl_error();
    });
}
//====================FUNCTIONS====================//

//========================================MODULE/APP NAME========================================//