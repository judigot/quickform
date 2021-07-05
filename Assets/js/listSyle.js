//========================================LIST MODULE========================================//

//====================GLOBAL VARIABLES====================//
var ls_selectedCell;
var ls_selectedCellAnimation = 200;
var ls_outsideTableClick;
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    setTimeout(function () {
        $(".table-container").append("<div class='selected-cell hidden'></div>").find(".selected-cell").hide();
    }, 500);

    $(document).on("mouseenter", "table", function (e) {
        ls_outsideTableClick = true;
    });

    $(document).on("mouseleave", "table", function (e) {
        ls_outsideTableClick = false;
    });

    $(document).on("focus", "input", function (e) {
        ls_selectedCell = $(this);
        $(".selected-cell").removeClass("hidden");
        ls_cellHighlighter("cell");
        if (!$(".selected-cell").is(":visible")) {
            $(".selected-cell").fadeIn(ls_selectedCellAnimation);
        }
    });

    $(document).on("click", "th", function (e) {
        $("input").blur();
        var columnIndex = $(this).index();
        ls_selectedCell = $(this);
        $(".selected-cell").removeClass("hidden");
        ls_cellHighlighter("column");
        if (!$(".selected-cell").is(":visible")) {
            $(".selected-cell").fadeIn(ls_selectedCellAnimation);
        }
    });

    $(document).on("click", function (e) {
        if (ls_outsideTableClick === false) {
            ls_selectedCell = "";
            if ($(".selected-cell").is(":visible")) {
                $(".selected-cell").fadeOut(ls_selectedCellAnimation);
            }
        }
    });

    $(window).on("resize", function (e) {
        if (ls_selectedCell) {
            if (ls_selectedCell.is("input")) {
                ls_cellHighlighter("cell");
            } else {
                ls_cellHighlighter("column");
            }
        }
    });
});
//====================GENERAL====================//

//====================FUNCTIONS====================//
function ls_cellHighlighter(type) {
    if (type === "cell") {
        $(".selected-cell").css({top: (ls_selectedCell.offset().top - 41) + "px", left: (ls_selectedCell.offset().left - 1 - 10) + "px", height: ($("td").height() + 3) + "px", width: ($("td").width() + 3) + "px"});
    } else if (type === "column") {
        $(".selected-cell").css({top: (ls_selectedCell.offset().top - 40.5) + "px", left: (ls_selectedCell.offset().left - 10.5) + "px", height: ($("table").height() + 2) + "px", width: ($("td").width() + 3) + "px"});
    }
}
//====================FUNCTIONS====================//

//========================================LIST MODULE========================================//