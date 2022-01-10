$(function () {
    $(window).scroll(function () {
        var scroll_top = $(window).scrollTop();
        if (scroll_top >= 100) {
            $("#action-bar").fadeIn();
        } else {
            $("#action-bar").fadeOut();
        }
    })
})