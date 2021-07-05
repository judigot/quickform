$(function () {
    window.history.replaceState({}, "", "");

    $(document).on("scroll", function (e) {
        collapseNavbar();
    });

    $(window).on("resize", function (e) {
        collapseNavbar();
    });

    $(document).on("click", "a.page-scroll", function (e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top + 100
        }, 500, 'easeInOutExpo');
        event.preventDefault();
    });

    $(document).on("click", ".navbar-collapse ul li a", function (e) {
        $(this).closest('.collapse').collapse('hide');
    });
});

function collapseNavbar() {
    if ($(".navbar").offset().top > 50 && !$(".navbar-toggle").is(":visible")) {
        $(".navbar-custom a").css({"color": "black"});
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-custom a").css({"color": "white"});
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}