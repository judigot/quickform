//========================================LIST MODULE========================================//

//====================GLOBAL VARIABLES====================//
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    // Generate list
    $(document).on("click", "#generateList", function (e) {
        $("#newEventList").find(".window-title").text("New List");
        $("#newEventList").modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#confirmNewEventList").hide();
    });
    $(document).on("click", "#uploadListTrigger", function (e) {
        $("#listContent").click();
    });
    $(document).on("change", "#listContent", function (e) {
        var fileName = this.files[0].name;
        $("#createListTrigger").hide();
        $("#confirmNewEventList").show();
        $("#newListContent").empty();
        $("#newListContent").append(fileName);
    });
    $(document).on("click", ".emptyNewEventList", function (e) {
        $("#createListTrigger").show();
        $("#newListContent").empty();
        $("#uploadListForm")[0].reset();
    });
    // View list
    $(document).on("dblclick", ".item-list", function (e) {
        window.open("list/" + $(this).attr("data-item-id"), "_blank");
    });
    $("#uploadListForm").on("submit", function (e) {
        e.preventDefault();
        var listContent = new FormData(this);
        $.ajax({
            url: "Classes/process.php",
            type: "POST",
            dataType: "text",
            contentType: false,
            processData: false,
            data: listContent
        }).done(function (data) {
            if (data === "invalid") {
                $.notify("Invalid CSV format.", {
                    className: "danger",
                    position: "bottom left"
                });
                var url = "home/lists";
                $(".notifyjs-bootstrap-base").append("Please follow the proper CSV format <a target='_blank' href='" + url + "' style='color: white; text-decoration: underline;'>here</a>.");
            }
            home_loadListData();
        }).fail(function (data) {});
        $("#createListTrigger").show();
        $("#newListContent").empty();
    });
    $(document).on("click", "#confirmNewEventList", function (e) {
        $("#submitListForm").trigger("click");
        $("#uploadListForm")[0].reset();
    });
    $(document).on("click", "#createListTrigger", function (e) {
        $("#newEventList").modal("hide");
        home_loadListData();
    });
});
//====================GENERAL====================//
//====================FUNCTIONS====================//
//====================FUNCTIONS====================//

//========================================LIST MODULE========================================//