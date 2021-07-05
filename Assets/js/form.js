//========================================FORM MODULE========================================//

//====================GLOBAL VARIABLES====================//
var form_formStructure;
var form_maxFieldAllowed = 10;
var form_fieldCount = 0;
var form_editField;
var form_originalContent;
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    $(document).on("click", ".editFieldTrigger", function (e) {
        var type = $(this).closest(".field-container").attr("data-type");
        if (type === "text" || type === "number") {
            type = "textfield";
        }
        switch (type) {
            case "textfield":
                form_editField = $(this).closest("div").attr("data-position");
                var oldType = $(this).closest("div").attr("data-type");
                // Get old title
                $("#newTextFieldTitle").val($("#formPreview").children().eq(form_editField - 1).attr("data-title"));
                // Get old type
                $(".editTextType").val(oldType);
                // Get old values
                if (oldType === "text") {
                    $("#numberTypeEdit").css({"display": "none"});
                    $("#textTypeEdit").css({"display": "initial"});
                    $("#newMaxLength").val($(this).closest("div").attr("data-maxlength"));
                } else {
                    $("#textTypeEdit").css({"display": "none"});
                    $("#numberTypeEdit").css({"display": "initial"});
                    $("#newMinRange").val($(this).closest("div").attr("data-min"));
                    $("#newMaxRange").val($(this).closest("div").attr("data-max"));
                }
                $('#editTextField').modal('show');
                break;
            case "boolean":
                form_editField = $(this).closest("div").attr("data-position");
                // Get old title
                $("#newBooleanFieldTitle").val($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
                // Get old default
                $("#newBooleanFieldDefault").prop("checked", false);
                if ($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default") === "true") {
                    $("#newBooleanFieldDefault").prop("checked", true);
                }
                $("#newBooleanFieldTitle" + form_editField).val($("#formPreview").children().eq(form_fieldCount - 1).children().eq(0).text());
                $("#editBooleanField").modal("show");
                break;
            case "dropdown":
                form_editField = $(this).closest("div").attr("data-position");
                // Get old title
                $("#newDropdownFieldTitle").val($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
                // Get old options
                $("#defaultOption, #oldOptions").empty();
                var values = JSON.parse($("#formPreview").find("[data-position='" + form_editField + "']").attr('data-options')).options;
                for (var i = 0; i < values.length; i++) {
                    $("#defaultOption").append("<option>" + values[i] + "</option>");
                    // Filter special characters
                    values[i] = form_filterSpecialChar(/&lt;|&gt;|&quot;|&#039;|&amp;/gi, values[i]);
                    $("#oldOptions").append("<span><input type='text'/> <i class='fa fa-times fa-1 removeDropdownOption' aria-hidden='true'></i><br><span>");
                    $("#oldOptions").find("input").eq(i).val(values[i]);
                }
                $("#defaultOption").val($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default"));
                $("#editDropdownField").modal("show");
                break;
            case "time":
                form_editField = $(this).closest("div").attr("data-position");
                // Get old title
                $("#newTimeFieldTitle").val($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
                // Get old default
                $("#newTimeFieldDefault").prop("checked", false);
                if ($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default") === "true") {
                    $("#newTimeFieldDefault").prop("checked", true);
                }
                $("#newTimeFieldTitle" + form_editField).val($("#formPreview").children().eq(form_fieldCount - 1).children().eq(0).text());
                $("#editTimeField").modal("show");
                break;
            case "radio":
                form_editField = $(this).closest("div").attr("data-position");
                // Get old title
                $("#newRadioFieldTitle").val($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
                $("#editRadioField").modal("show");
                break;
        }
    });
    $(".modal-dialog").draggable({
        handle: ".title-bar"
    });
    $("#formPreview").sortable({
        start: function (event, ui) {
            ui.item.css({"opacity": "0.5"});
        },
        stop: function (event, ui) {
            ui.item.css({"opacity": "1"});
        },
        update: function (event, ui) {
            form_generateId(form_fieldCount);
        }
    });
    // Generate form
    $(document).on("click", "#generateForm", function (e) {
        $("#confirmNewEventForm").hide();
        $("#newEventForm").find(".window-title").text("New Form");
        $('#newEventForm').modal({
            backdrop: 'static',
            keyboard: false
        });
    });
    $(document).on("click", ".emptyNewEventForm", function (e) {
        $("#form-name").val("");
        $("#formPreview").empty();
        $(".removeAllFormFields").hide();
        $("#confirmNewEventForm").hide();
    });
    // View generated form
    $(document).on("dblclick", ".item-form", function (e) {
        form_viewForm($(this), "view");
    });
    // Add Field
    $(document).on("input", "#form-name", function (e) {
        form_checkValues();
    });
    $(document).on("click", ".formField", function (e) {
        if (!$(".removeAllFormFields").is(":visible")) {
            $(".removeAllFormFields").show();
        }
        if ($("#formPreview").children().length < form_maxFieldAllowed) {
            custom_playAudio("Assets/sounds/addField.wav");
            var field = $(this).attr("value");
            switch (field) {
                case "text":
                    $("#formPreview").append($("#fieldSource").children(".textField").clone());
                    form_fieldCount = $("#formPreview").children().length;
                    $("#formPreview").children().eq(form_fieldCount - 1).children(".textInput").attr("type", $("#formPreview").children().eq(form_fieldCount - 1).attr("data-type"));
                    $("#formPreview").children().eq(form_fieldCount - 1).hide().show("drop", {
                        direction: "left"
                    }, 100);
                    break;
                case "boolean":
                    $("#formPreview").append($("#fieldSource").children(".booleanField").clone());
                    form_fieldCount = $("#formPreview").children().length;
                    $("#formPreview").children().eq(form_fieldCount - 1).hide().show("drop", {
                        direction: "left"
                    }, 100);
                    break;
                case "dropdown":
                    $("#formPreview").append($("#fieldSource").children(".dropdownField").clone());
                    form_fieldCount = $("#formPreview").children().length;
                    var values = JSON.parse($("#formPreview").children().eq(form_fieldCount - 1).attr('data-options')).options;
                    for (var i = 0; i < values.length; i++) {
                        $("#formPreview").children().eq(form_fieldCount - 1).children(".options").append("<option>" + values[i] + "</option>");
                    }
                    $("#formPreview").children().eq(form_fieldCount - 1).hide().show("drop", {
                        direction: "left"
                    }, 100);
                    break;
                case "radio":
                    $("#formPreview").append($("#fieldSource").children(".radioField").clone());
                    form_fieldCount = $("#formPreview").children().length;
                    $("#formPreview").children().eq(form_fieldCount - 1).hide().show("drop", {
                        direction: "right"
                    }, 100);
                    break;
                case "time":
                    $("#formPreview").append($("#fieldSource").children(".timeField").clone());
                    form_fieldCount = $("#formPreview").children().length;
                    $("#formPreview").children().eq(form_fieldCount - 1).hide().show("drop", {
                        direction: "left"
                    }, 100);
                    break;
            }
            $("#formPreview").stop().animate({scrollTop: $("#formPreview").prop("scrollHeight")}, 500);
        } else {
            if (!$(".notifyjs-wrapper").is(":visible")) {
                $.notify("Only a maximum number of " + form_maxFieldAllowed + " fields is allowed.", {
                    className: "danger",
                    position: "bottom left"
                });
            }
        }
        $("#formPreview").children().eq(form_fieldCount - 1).find(".title").text($("#formPreview").children().eq(form_fieldCount - 1).attr("data-title"));
        form_generateId(form_fieldCount);
        form_checkValues();
    });
    $(document).on("click", ".removeField", function (e) {
        $(this).closest('div').hide(100, function () {
            $(this).closest('div').remove();
            if ($("#formPreview").children().length === 0) {
                $(".removeAllFormFields").hide();
                $("#confirmNewEventForm").hide();
            } else {
                form_generateId(form_fieldCount);
            }
            custom_playAudio("Assets/sounds/removeField.wav");
        });
    });
    $(document).on("click", ".removeAllFormFields", function (e) {
        for (var i = 0; i < $("#formPreview").children().length; i++) {
            $("#formPreview").children().eq(i).hide((i + 1) * 100, function () {
                $("#formPreview").children().eq(0).remove();
            });
        }
        $(this).hide();
        $("#confirmNewEventForm").hide();
    });
    $(document).on("click", "#confirmNewEventForm", function (e) {
        if ($("#formPreview").children().length !== 0) {
            var form = [];
            var child = $("#formPreview").children();
            for (var i = 0; i < $("#formPreview").children().length; i++) {
                var field;
                switch (child.eq(i).attr("data-type")) {
                    case "text":
                        var id = i + 1;
                        var title = child.eq(i).attr("data-title");
                        var type = child.eq(i).attr("data-type");
                        var maxLength = child.eq(i).children("input").attr("maxlength") ? child.eq(i).children("input").attr("maxlength") : null;
                        field = {
                            "id": id,
                            "position": id,
                            "title": title,
                            "type": type,
                            "maxLength": maxLength
                        };
                        form = form.concat(field);
                        break;
                    case "number":
                        var id = i + 1;
                        var title = child.eq(i).attr("data-title");
                        var type = child.eq(i).attr("data-type");
                        var minRange = child.eq(i).children("input").attr("min") ? child.eq(i).children("input").attr("min") : null;
                        var maxRange = child.eq(i).children("input").attr("max") ? child.eq(i).children("input").attr("max") : null;
                        field = {
                            "id": id,
                            "position": id,
                            "title": title,
                            "type": type,
                            "minVal": minRange,
                            "maxVal": maxRange
                        };
                        form = form.concat(field);
                        break;
                    case "boolean":
                        var id = i + 1;
                        var title = child.eq(i).attr("data-title");
                        var type = child.eq(i).attr("data-type");
                        var booleanDefault = child.eq(i).attr("data-default");
                        field = {
                            "id": id,
                            "position": id,
                            "title": title,
                            "type": type,
                            "default": booleanDefault
                        };
                        form = form.concat(field);
                        break;
                    case "dropdown":
                        var id = i + 1;
                        var title = child.eq(i).attr("data-title");
                        var type = child.eq(i).attr("data-type");
                        var values = JSON.parse(child.eq(i).attr("data-options"));
                        var defaultValue = child.eq(i).attr("data-default");
                        field = {
                            "id": id,
                            "position": id,
                            "title": title,
                            "type": type,
                            "values": values,
                            "default": defaultValue
                        };
                        form = form.concat(field);
                        break;
                    case "time":
                        var id = i + 1;
                        var title = child.eq(i).attr("data-title");
                        var type = child.eq(i).attr("data-type");
                        var timeDefault = child.eq(i).attr("data-default");
                        field = {
                            "id": id,
                            "position": id,
                            "title": title,
                            "type": type,
                            "default": timeDefault
                        };
                        form = form.concat(field);
                        break;
                    case "radio":
                        var id = i + 1;
                        var title = child.eq(i).attr("data-title");
                        var type = child.eq(i).attr("data-type");
                        break;
                }
            }
            form_formStructure = JSON.stringify(form);
            $(document).trigger("insertNewForm");
            $("#form-name").val("");
            $("#formPreview").empty();
        }
        $("#newEventForm").modal("hide");
    });
    $(document).on("insertNewForm", function () {
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "text",
            data: {
                create: "insertForm",
                data: {
                    formName: $("#form-name").val(),
                    jsonForm: form_formStructure
                }
            }
        }).done(function (data) {
            home_loadFormData();
        }).fail(function (data) {});
    });
});
//====================GENERAL====================//

//====================TEXT FIELD====================//
$(function () {
    $(document).on("change", ".editTextType", function (e) {
        if ($(".editTextType").val() === "text") {
            $("#numberTypeEdit").css({"display": "none"});
            $("#textTypeEdit").css({"display": "initial"});
            $("#newMaxLength").val($("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").attr("maxlength"));
        } else {
            $("#textTypeEdit").css({"display": "none"});
            $("#numberTypeEdit").css({"display": "initial"});
            $("#newMinRange").val($("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").attr("min"));
            $("#newMaxRange").val($("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").attr("max"));
        }
    });
    $(document).on("click", "#confirmTextFieldEdits", function (e) {
        // Set new title
        var newTitle = $("#newTextFieldTitle").val();
        if (newTitle) {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title", newTitle);
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".title").text($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
        }
        // Set new type
        var newType = $(".editTextType").val();
        $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-type", newType);
        $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-type", newType);
        $("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").attr("type", $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-type"));
        // Set new values
        if (newType === "text") {
            var newMaxLength = $("#newMaxLength").val();
            $("#formPreview").find("[data-position='" + form_editField + "']").removeAttr("data-min data-max");
            $("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").removeAttr("min max");
            if (newMaxLength) {
                $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-maxlength", newMaxLength);
                $("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").attr("maxlength", $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-maxlength"));
            } else {
                $("#formPreview").find("[data-position='" + form_editField + "']").removeAttr("data-maxlength");
                $("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").removeAttr("maxlength");
            }
        } else {
            var newMinRange = $("#newMinRange").val();
            var newMaxRange = $("#newMaxRange").val();
            $("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").removeAttr("maxlength");
            $("#formPreview").find("[data-position='" + form_editField + "']").removeAttr("data-maxlength");
            if (newMinRange) {
                $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-min", newMinRange);
                $("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").attr("min", $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-min"));
            }
            if (newMaxRange) {
                $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-max", newMaxRange);
                $("#formPreview").find("[data-position='" + form_editField + "']").children(".textInput").attr("max", $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-max"));
            }
        }
        $('#editTextField').modal('hide');
    });
});
//====================TEXT FIELD====================//

//====================BOOLEAN FIELD====================//
$(function () {
    $(document).on("click", "#confirmBooleanFieldEdits", function (e) {
        // Set new title
        var newTitle = $("#newBooleanFieldTitle").val();
        if (newTitle) {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title", newTitle);
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".title").text($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
        }
        if ($('#newBooleanFieldDefault').is(':checked')) {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default", "true");
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".booleanInput").prop("checked", true);
        } else {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default", "false");
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".booleanInput").prop("checked", false);
        }
        $('#editBooleanField').modal('hide');
    });
});
//====================BOOLEAN FIELD====================//

//====================DROPDOWN FIELD====================//
$(function () {
    $("#oldOptions").sortable({
        update: function () {
            var options = [];
            $("#defaultOption").empty();
            for (var i = 0; i < $("#oldOptions").children().length; i++) {
                $("#defaultOption").append("<option>" + $("#oldOptions").find("input").eq(i).val() + "</option>");
                options = options.concat($("#oldOptions").find("input").eq(i).val());
            }
            if (jQuery.inArray($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default"), options) !== -1) {
                $("#defaultOption").val($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default"));
            } else {
                $("#defaultOption").val($("#oldOptions").find("input").eq(0).val());
            }
        }
    });
    $(document).on("addNewOption", function () {
        var newValue = form_filterSpecialChar(/<|>|&/gi, $("#newDropdownOption").val());
        $("#defaultOption").append("<option>" + newValue + "</option>");
        $("#oldOptions").append("<span><input type='text'/> <i class='fa fa-times fa-1 removeDropdownOption' aria-hidden='true'></i><br><span>");
        $("#oldOptions").find("input").eq($("#oldOptions").children("input").length - 1).val($("#newDropdownOption").val());
        if ($("#newDropdownOption").val() === $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default")) {
            $("#defaultOption").val($("#newDropdownOption").val());
        }
        $("#newDropdownOption").val("");
    });
    $(document).on("click", ".addNewOption", function (e) {
        if ($("#newDropdownOption").val()) {
            $(document).trigger("addNewOption");
            $("#newDropdownOption").focus();
        }
    });
    $(document).on("keydown", "#newDropdownOption", function (e) {
        if (e.keyCode === 13 && $("#newDropdownOption").val()) {
            $(document).trigger("addNewOption");
        }
    });
    $(document).on("click", ".removeDropdownOption", function (e) {
        var removedIndex = $(this).closest("span").index();
        $(this).closest("span").remove();
        $("#defaultOption").children().eq(removedIndex).remove();
    });
    $(document).on("keyup", "#oldOptions > span > input", function (e) {
        var editedIndex = $(this).closest("span").index();
        $("#defaultOption").children().eq(editedIndex).text($(this).val());
    });
    $(document).on("click", "#confirmDropdownFieldEdits", function (e) {
        // Set new title
        var newTitle = $("#newDropdownFieldTitle").val();
        if (newTitle) {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title", newTitle);
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".title").text($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
        }
        // Set new options
        var newOptions = [];
        for (var i = 0; i < $("#oldOptions").children().length; i++) {
            // Filter special characters
            var newValue = form_filterSpecialChar(/<|>|&/gi, $("#oldOptions").find("input").eq(i).val());
            newOptions = newOptions.concat(JSON.stringify(newValue));
        }
        $("#formPreview").find("[data-position='" + form_editField + "']").attr('data-options', '{"options" : [' + newOptions + ']}');
        $("#formPreview").children().eq(form_editField - 1).children(".options").empty();
        var values = JSON.parse($("#formPreview").children().eq(form_editField - 1).attr('data-options')).options;
        for (var i = 0; i < values.length; i++) {
            $("#formPreview").children().eq(form_editField - 1).children(".options").append("<option>" + values[i] + "</option>");
        }
        $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default", $("#defaultOption").val());
        $("#formPreview").find("[data-position='" + form_editField + "']").find(".options").val($("#defaultOption").val());
        $('#editDropdownField').modal('hide');
    });
});
//====================DROPDOWN FIELD====================//

//====================TIME FIELD====================//
$(function () {
    $(document).on("keydown", ".time-input", function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    });
    $(document).on("click", ".time-input", function (e) {
        var date = new Date();
        var time = date.toLocaleTimeString();
        var currentSwitch = $(this);
        currentSwitch.closest(".switch").css({
            "pointer-events": "none"
        });
        setTimeout(function () {
            if (!currentSwitch.closest(".switch").attr("data-signed-out")) {
                currentSwitch.closest(".switch").addClass("rotate180");
            }
            if (!currentSwitch.closest(".switch").attr("data-signed-in")) {
                currentSwitch.closest(".switch").attr("data-signed-in", "true");
                currentSwitch.siblings(".time-switch").addClass("signed-out");
                setTimeout(function () {
                    currentSwitch.closest(".switch").css({
                        "pointer-events": "auto"
                    });
                }, 1000);
                currentSwitch.closest(".timeField").append('<span class="time-data time-in">In:&nbsp' + time + '</span>').children().last().hide().show(100);
            } else {
                currentSwitch.closest(".switch").attr("data-signed-out", "true");
                currentSwitch.closest(".timeField").append('<br><span class="time-data time-out">Out:&nbsp' + time + '</span>').children().last().hide().show(100);
            }
            if (currentSwitch.closest(".switch").attr("data-signed-out")) {
            }
        }, 500);
    });
    $(document).on("click", "#confirmTimeFieldEdits", function (e) {
        // Set new title
        var newTitle = $("#newTimeFieldTitle").val();
        if (newTitle) {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title", newTitle);
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".title").text($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
        }
        if ($('#newTimeFieldDefault').is(':checked')) {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default", "true");
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".time-input").prop("checked", true);
        } else {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-default", "false");
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".time-input").prop("checked", false);
        }
        $('#editTimeField').modal('hide');
    });
});
//====================TIME FIELD====================//

//====================RADIO FIELD====================//
$(function () {
    $(document).on("click", "#confirmRadioFieldEdits", function (e) {
        // Set new title
        var newTitle = $("#newRadioFieldTitle").val();
        if (newTitle) {
            $("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title", newTitle);
            $("#formPreview").find("[data-position='" + form_editField + "']").find(".title").text($("#formPreview").find("[data-position='" + form_editField + "']").attr("data-title"));
        }
        $('#editRadioField').modal('hide');
    });
});
//====================RADIO FIELD====================//

//====================FUNCTIONS====================//
function form_viewForm(selected, viewType) {
    var formContent = JSON.parse(selected.attr("data-form-content"));

    var formModal = viewType === "view" ? "#formViewerModal" : "#newEventForm";
    var formContainer = viewType === "view" ? "#formViewer" : "#formPreview";

    $(formModal).modal("show");
    $(formContainer).empty();
    $(formModal).find(".window-title").text(selected.attr("data-item-name"));
    $(formModal).find("#form-name").val(selected.attr("data-item-name"));

    for (var i = 0; i < formContent.length; i++) {
        var title = formContent[i].title;
        var type = formContent[i].type;
        switch (type) {
            case "text":
                $(formContainer).append($("#fieldSource").children(".textField").clone());
                form_fieldCount = $(formContainer).children().length;
                $(formContainer).children().eq(form_fieldCount - 1).attr("data-type", type);
                $(formContainer).children().eq(form_fieldCount - 1).children(".textInput").attr("type", type);
                formContent[i].maxLength !== null ? $(formContainer).children().eq(form_fieldCount - 1).attr("data-maxlength", formContent[i].maxLength) : false;
                formContent[i].maxLength !== null ? $(formContainer).children().eq(form_fieldCount - 1).children(".textInput").attr("maxlength", formContent[i].maxLength) : false;
                break;
            case "number":
                $(formContainer).append($("#fieldSource").children(".textField").clone());
                form_fieldCount = $(formContainer).children().length;
                $(formContainer).children().eq(form_fieldCount - 1).attr("data-type", type);
                $(formContainer).children().eq(form_fieldCount - 1).children(".textInput").attr("type", type);
                $(formContainer).children().eq(form_fieldCount - 1).removeAttr("data-maxlength");
                formContent[i].minVal !== null ? $(formContainer).children().eq(form_fieldCount - 1).attr("data-min", formContent[i].minVal) : false;
                formContent[i].minVal !== null ? $(formContainer).children().eq(form_fieldCount - 1).children(".textInput").attr("min", formContent[i].minVal) : false;
                formContent[i].maxVal !== null ? $(formContainer).children().eq(form_fieldCount - 1).attr("data-max", formContent[i].maxVal) : false;
                formContent[i].maxVal !== null ? $(formContainer).children().eq(form_fieldCount - 1).children(".textInput").attr("max", formContent[i].maxVal) : false;
                break;
            case "boolean":
                $(formContainer).append($("#fieldSource").children(".booleanField").clone());
                form_fieldCount = $(formContainer).children().length;
                $(formContainer).children().eq(form_fieldCount - 1).attr("data-default", formContent[i].default);
                $(formContainer).children().eq(form_fieldCount - 1).find(".booleanInput").prop("checked", JSON.parse(formContent[i].default));
                break;
            case "dropdown":
                $(formContainer).append($("#fieldSource").children(".dropdownField").clone());
                form_fieldCount = $(formContainer).children().length;
                var values = formContent[i].values["options"];
                // Set data attributes
                $(formContainer).children().eq(form_fieldCount - 1).attr("data-options", '{"options" : ' + JSON.stringify(values) + "}");
                $(formContainer).children().eq(form_fieldCount - 1).attr("data-default", formContent[i].default);
                // Set HTML data view
                for (var j = 0; j < values.length; j++) {
                    $(formContainer).children().eq(form_fieldCount - 1).children(".options").append("<option>" + values[j] + "</option>");
                }
                $(formContainer).children().eq(form_fieldCount - 1).find(".options").val(formContent[i].default);
                break;
            case "time":
                $(formContainer).append($("#fieldSource").children(".timeField").clone());
                form_fieldCount = $(formContainer).children().length;
                break;
        }
        $(formContainer).children().eq(form_fieldCount - 1).attr("data-position", i + 1);
        $(formContainer).children().eq(form_fieldCount - 1).attr("data-title", title);
        $(formContainer).children().eq(form_fieldCount - 1).find(".title").text(title);
    }
    if (viewType === "view") {
        $(formModal).find(".editFieldTrigger, .removeField").remove();
    }
    form_originalContent = $(formContainer).html();
}
function form_filterSpecialChar(regex, rawValue) {
    return rawValue.replace(regex, function (char) {
        var specialCharacters = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
            "&": "&amp;",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": "\"",
            "&#039;": "'",
            "&amp;": "&"
        };
        return specialCharacters[char];
    });
}
function form_generateId(form_fieldCount) {
    for (var i = 0; i < form_fieldCount; i++) {
        $("#formPreview").children().eq(i).attr("data-position", (i + 1));
    }
}
function form_checkValues() {
    if ($("#form-name").val() && $("#formPreview").children().length !== 0) {
        $("#confirmNewEventForm").show();
    } else {
        $("#confirmNewEventForm").hide();
    }
}
//====================FUNCTIONS====================//

//========================================FORM MODULE========================================//