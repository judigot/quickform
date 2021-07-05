//========================================HOME MODULE========================================//

//====================GLOBAL VARIABLES====================//
var home_mainContentClicked;
var home_selectedItems = [];
var home_autoUpdateInverval = 1000;
var home_eventsAutoUpdate;
var home_formsAutoUpdate;
var home_listsAutoUpdate;
var home_reportsAutoUpdate;
var home_itemType;

var home_eventResult;
var home_formResult;
var home_listResult;
var home_reportResult;
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
//==========CONTEXT MENU==========//
$(function () {
    $.contextMenu({
        selector: '.context-menu',
        items: {
            "View": {name: "View"},
            "Edit": {name: "Edit"},
            "Duplicate": {name: "Duplicate"},
            "sep1": "-----",
            "Delete": {name: "Delete"},
            "Rename": {name: "Rename"}
        },
        callback: function (key, options) {
            if (key === "View") {
                if ($(this).attr("data-item-type") === "event") {
                } else if ($(this).attr("data-item-type") === "form") {
                    form_viewForm($(this), "view");
                }
            } else if (key === "Edit") {
                if ($(this).attr("data-item-type") === "event") {
                } else if ($(this).attr("data-item-type") === "form") {
                    form_viewForm($(this), "edit");
                }
            } else if (key === "Duplicate") {
                home_duplicateItem($(this).attr("data-item-id"), $(this).attr("data-item-type"));
            } else if (key === "Delete") {
                home_prepareDelete($(this));
            } else if (key === "Rename") {
                home_prepareRename($(this));
            }
        }
    });
    $.contextMenu({
        selector: '.context-list',
        items: {
            "Edit": {name: "Edit"},
            "Duplicate": {name: "Duplicate"},
            "sep1": "-----",
            "Delete": {name: "Delete"},
            "Rename": {name: "Rename"}
        },
        callback: function (key, options) {
            if (key === "Edit") {
                window.open("list/" + $(this).attr("data-item-id"), "_blank");
            } else if (key === "Duplicate") {
                home_duplicateItem($(this).attr("data-item-id"), $(this).attr("data-item-type"));
            } else if (key === "Delete") {
                home_prepareDelete($(this));
            } else if (key === "Rename") {
                home_prepareRename($(this));
            }
        }
    });
    $(document).on("input", "#newItemName", function () {
        if ($(this).val() !== $(this).attr("data-old-item-name") || $(this).val() === "") {
            $("#confirmRenameItem").show();
        } else {
            $("#confirmRenameItem").hide();
        }
    });
    $(document).on("click", "#confirmRenameItem", function () {
        var id = $("#newItemName").attr("data-item-id");
        var newName = $("#newItemName").val();
        var type = $("#newItemName").attr("data-item-type");

        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "text",
            data: {
                update: "renameItem",
                data: {
                    id: id,
                    type: type,
                    newName: newName
                }
            }
        }).done(function (data) {
        }).fail(function (data) {
        });
    });
    $(document).on("keydown", "#newItemName", function (e) {
        if (e.keyCode === 13) {
            $("#confirmRenameItem").trigger("click");
        }
    });
});
//==========CONTEXT MENU==========//
$(function () {
//    $(document).on("adjustSize", function () {
//        var mainContentHeight = window.innerHeight - $(".navbar").height();
//        var mainContentWidth = window.innerWidth - $("#sidebar").width();
//        var mainContentWidth = screen.width - $("#sidebar").width();
//        $(".main-content").css({"width": mainContentWidth - 1 + "px"});
//        $(".item").css({"height": $(".item-form").width() + "px"});
//    });
//    $(document).trigger("adjustSize");
//    $(window).on("resize", function (e) {
//        $(document).trigger("adjustSize");
//    });
    $(document).on("click", "#logout-button", function (e) {
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "text",
            data: {
                logoutUser: ""
            }
        }).done(function (data) {
            if (data === "1") {
                window.location.replace("login");
            } else if (data === "0" || data === "nodata") {
                window.location.replace("home");
            }
        }).fail(function (data) {
            window.location.replace("home");
        });
    });
    //==========Item selection==========//
    // Item clicked
    $(document).on("click", ".item", function (e) {
        e.stopPropagation();
        if (!e.ctrlKey) {
            home_selectedItems.length = 0;
            $(".item").removeClass("item-selected");
        }
        if (home_selectedItems.indexOf($(this).attr("data-item-id")) === -1) {
            home_selectedItems.push($(this).attr("data-item-id"));
        }
        $(this).addClass("item-selected");
        home_mainContentClicked = true;
    });
    // Main content clicked
    $(document).on("click", ".main-content", function (e) {
        $(".item").removeClass("item-selected");
        home_selectedItems.length = 0;
        home_mainContentClicked = true;
    });
    // Document clicked
    $(document).on("click", function (e) {
        if (!$(e.target).hasClass("main-content") && !$(e.target).hasClass("item-container")) {
            home_mainContentClicked = false;
        }
    });
    $(document).on("keydown", function (e) {
        // Select all items
        if (e.ctrlKey && e.keyCode === 65 && home_mainContentClicked === true) {
            home_selectedItems.length = 0;
            var contentType;
            var itemId;
            if (home_itemType === "event") {
                contentType = ".events-content";
                itemId = "data-item-id";
            } else if (home_itemType === "form") {
                contentType = ".forms-content";
                itemId = "data-item-id";
            } else if (home_itemType === "list") {
                contentType = ".lists-content";
                itemId = "data-item-id";
            } else if (home_itemType === "report") {
                contentType = ".reports-content";
                itemId = "data-item-id";
            }
            $(contentType).children().each(function () {
                if ($(this).attr(itemId)) {
                    home_selectedItems.push($(this).attr(itemId));
                    $(this).addClass("item-selected");
                }
            });
        }
        // Delete item/s
        if (e.keyCode === 46 && home_selectedItems.length !== 0) {
            home_deleteMessages();
            $("#deleteItem").modal({
                backdrop: 'static',
                keyboard: false
            });
            $("#confirmDeleteItem").focus();
        }
    });
    $(document).on("click", "#confirmDeleteItem", function (e) {
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "text",
            data: {
                delete: "deleteItems",
                itemType: home_itemType === "report" ? "event" : home_itemType,
                data: JSON.stringify(home_selectedItems)
            }
        }).done(function (data) {
            var container = "." + home_itemType + "s-content";
            if (home_itemType === "event") {
                home_loadEventData("checkOngoingEventUpdates");
            } else if (home_itemType === "form") {
                home_loadFormData();
            } else if (home_itemType === "list") {
                home_loadListData();
            }
            var deletionError = false;
            var items = [];

            var rowCount = parseInt(data);
            setTimeout(function () {
                if (rowCount !== 0) {
                    home_selectedItems.length = 0;
                    custom_playAudio("Assets/sounds/deleteItem.wav");
                } else {
                    var message;
                    if (home_selectedItems.length === 1) {
                        message = "Cannot delete this item. Make sure it is not being used by any events.";
                    } else {
                        message = "Cannot delete items. Make sure the selected items are not being used by any events.";
                    }
                    if (!$(".notifyjs-wrapper").is(":visible")) {
                        $.notify(message, {
                            className: "danger",
                            position: "bottom left"
                        });
                    }
                }
            }, 100);
        }).fail(function (data) {
        });
    });
    //==========Item selection==========//
});
//====================GENERAL====================//

//==========LOAD DYNAMIC CONTENT==========//
$(function () {
    home_loadContent();
    $(document).on("click", "#eventsContent", function (e) {
        home_setContent("events");
    });
    $(document).on("click", "#formsContent", function (e) {
        home_setContent("forms");
    });
    $(document).on("click", "#listsContent", function (e) {
        home_setContent("lists");
    });
    $(document).on("click", "#reportsContent", function (e) {
        home_setContent("reports");
    });
});
//==========LOAD DYNAMIC CONTENT==========//

//====================FUNCTIONS====================//
function home_loadContent() {
    var currentPage = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
    var pages = ["home", "events", "forms", "lists", "reports"];
    if (pages.indexOf(currentPage) !== -1) {
        $(".toggle-content").removeClass("active-content");
        if (currentPage === pages[0] || currentPage === pages[1]) {
            home_loadEventData("checkOngoingEventUpdates");
        } else if (currentPage === pages[2]) {
            home_loadFormData();
        } else if (currentPage === pages[3]) {
            home_loadListData();
        } else if (currentPage === pages[4]) {
            home_loadEventData("checkFinishedEventUpdates");
        }
    } else {
        $("#eventsContent").trigger("click");
    }
}
function home_setContent(contentType) {
    var contentTypeUpper = contentType === "reports" ? "Inactive Events" : contentType[0].toUpperCase() + contentType.substr(1);
    var contentTypeSliced = contentTypeUpper.substr(0, contentTypeUpper.length - 1);
    home_itemType = contentType.substr(0, contentType.length - 1);
    window.history.pushState({}, "", "home/" + contentType);
    document.title = contentTypeUpper + " - Quickform";
    $(".toggle-content").removeClass("active-content");
    $("#" + contentType + "Content").addClass("active-content");
    clearInterval(home_eventsAutoUpdate);
    clearInterval(home_formsAutoUpdate);
    clearInterval(home_listsAutoUpdate);
    clearInterval(home_reportsAutoUpdate);
    $(".events-content, .forms-content, .lists-content, .reports-content").hide();
    $("." + contentType + "-content").show();
    var eventParameter = "";
    if (contentType === "events") {
        eventParameter = "\"checkOngoingEventUpdates\"";
    } else if (contentType === "reports") {
        eventParameter = "\"checkFinishedEventUpdates\"";
    }
    contentTypeSliced = contentType === "events" || contentType === "reports" ? "Event" : contentTypeSliced;
    //==========Auto-update==========//
    eval("home_load" + contentTypeSliced + "Data(" + eventParameter + ");home_" + contentType + "AutoUpdate = setInterval(function () {home_load" + contentTypeSliced + "Data(" + eventParameter + ");}, home_autoUpdateInverval);");
    //==========Auto-update==========//
}
function home_loadEventData(eventStatus) {
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "json",
        data: {
            read: eventStatus
        }
    }).done(function (data) {
        var hash = data[0];
        var result = data[1];
        if (result.length) {
            if (eventStatus === "checkOngoingEventUpdates") {
                if (home_eventResult !== hash) {
                    home_eventResult = hash;
                    $(".events-content").empty();
                    home_buildItem("event", result);
                    home_setContent("events");
                }
            } else {
                if (home_reportResult !== hash) {
                    home_reportResult = hash;
                    $(".reports-content").empty();
                    home_buildItem("report", result);
                    home_setContent("reports");
                }
            }
        } else {
            if (eventStatus === "checkOngoingEventUpdates") {
                home_eventResult = "";
                $(".events-content").empty();
                $(".events-content").append('<div class="item-placeholder"><i class="fa fa-calendar" aria-hidden="true"></i><br><div class="item-placeholder-title">No events</div></div>');
            } else {
                home_reportResult = "";
                $(".reports-content").empty();
                $(".reports-content").append('<div class="item-placeholder"><i class="fa fa-file" aria-hidden="true"></i><br><div class="item-placeholder-title">No reports</div></div>');
            }
        }
    }).fail(function (data) {
    });
}
function home_loadFormData() {
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "json",
        data: {
            read: "checkFormUpdates"
        }
    }).done(function (data) {
        var hash = data[0];
        var result = data[1];
        if (result.length) {
            if (home_formResult !== hash) {
                home_formResult = hash;
                $(".forms-content").empty();
                home_buildItem("form", result);
                home_setContent("forms");
            }
        } else {
            $(".forms-content").empty();
            $(".forms-content").append('<div class="item-placeholder"><i class="fa fa-file-text" aria-hidden="true"></i><br><div class="item-placeholder-title">No forms</div></div>');
        }
    }).fail(function (data) {
    });
}
function home_loadListData() {
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "json",
        data: {
            read: "checkListUpdates"
        }
    }).done(function (data) {
        var hash = data[0];
        var result = data[1];
        if (result.length) {
            if (home_listResult !== hash) {
                home_listResult = hash;
                $(".lists-content").empty();
                home_buildItem("list", result);
                home_setContent("lists");
            }
        } else {
            $(".lists-content").empty();
            $(".lists-content").append('<div class="item-placeholder"><i class="fa fa-list-ul" aria-hidden="true"></i><br><div class="item-placeholder-title">No lists</div></div>');
        }
    }).fail(function (data) {
    });
}
function home_buildItem(itemType, result) {
    for (var i = 0; i < result.length; i++) {
        var reportType = itemType === "report" ? "event" : itemType;
        var itemName = result[i][(reportType) + "_name"].length > 20 ? result[i][(reportType) + "_name"].substring(0, 15) + "..." : result[i][(reportType) + "_name"];
        if (itemName[itemName.length - 4] === " ") {
            itemName = itemName.slice(0, itemName.length - 4) + "...";
        }
        $("." + itemType + "s-content").append($(".element-source").children(".item-" + itemType).clone());
        $("." + itemType + "s-content").children().eq(i).attr("data-item-id", result[i][(reportType) + "_id"]).find(".item-name").text(itemName);
        $("." + itemType + "s-content").children().eq(i).attr("data-item-name", result[i][(reportType) + "_name"]);
        if (itemType === "form") {
            $("." + itemType + "s-content").children().eq(i).attr("data-" + itemType + "-content", result[i][itemType + "_content"]);
        }
    }
}
function home_deleteMessages() {
    if (home_selectedItems.length === 1) {
        $("#deleteItem").find(".window-title").text("Delete Item");
        $("#deleteItem").find(".modal-body").text("Are you sure you want to delete this item?");
    } else {
        $("#deleteItem").find(".window-title").text("Delete Multiple Items");
        $("#deleteItem").find(".modal-body").text("Are you sure you want to delete these items?");
    }
}
function home_duplicateItem(id, type) {
    $.ajax({
        url: "Classes/process.php",
        type: "POST",
        dataType: "json",
        data: {
            duplicate: "duplicateItem",
            data: {
                id: id,
                itemType: type
            }
        }
    }).done(function (data) {}).fail(function (data) {});
}
function home_prepareDelete(item) {
    if (home_selectedItems.length === 0) {
        home_selectedItems.length = 0;
        home_selectedItems.push(item.attr("data-item-id"));
        item.addClass("item-selected");
    }
    home_mainContentClicked = true;
    home_deleteMessages();
    $("#deleteItem").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#confirmDeleteItem").focus();
}
function home_prepareRename(item) {
    var oldName = item.attr("data-item-name");
    var type = item.attr("data-item-type");
    var itemId = item.attr("data-item-id");
    $("#newItemName").val(oldName).attr("data-item-id", itemId).attr("data-old-item-name", oldName).attr("data-item-type", type);
    $('#renameItem').modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#newItemName").focus();
    $("#confirmRenameItem").hide();
}
//====================FUNCTIONS====================//

//========================================HOME MODULE========================================//