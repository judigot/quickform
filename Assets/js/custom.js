//========================================MODULE/APP NAME========================================//

//====================GLOBAL VARIABLES====================//
var key = {a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90};
//====================GLOBAL VARIABLES====================//

//====================GENERAL====================//
$(function () {
    $("body").fadeIn(500).attr("spellcheck", false);
    $(document).on("mouseenter mouseleave", ".fa-certificate", function (e) {
        $(this).toggleClass("rotate180", 1000);
    });
    $(document).on("contextmenu", function (e) {
        return false;
    });
    $(document).on("keydown", function (e) {
        if (e.ctrlKey && e.keyCode === key.s) {
            e.preventDefault();
        }
    });
});
//====================GENERAL====================//

//====================MODULE FUNCTIONALITY====================//
$(function () {
});
//====================MODULE FUNCTIONALITY====================//

//====================FUNCTIONS====================//
function helloWorld() {
    alert("Hello, world!");
}
function custom_playAudio(source) {
    var sound = new Audio(source).play();
    if (sound !== undefined) {
        sound.then(_ => {
        }).catch(error => {
        });
    }
}
//====================FUNCTIONS====================//

//========================================MODULE/APP NAME========================================//