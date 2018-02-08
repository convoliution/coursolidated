// menu animation
$(function() {
    var menuAnimTime = 250;
    $('#menu-top > button').prop('visible', false);
    $('#menu-top > button').tap(function() {
        if (!$('#menu').prop('visible')) {
            $('#menu').animate({
                left: 0
            }, menuAnimTime);
            $('#menu-top').animate({
                left: 0
            }, menuAnimTime);
            $('main').animate({
                marginLeft: $('#menu').width()
            }, menuAnimTime);
            $('#menu').prop('visible', true);
        } else {
            $('#menu').animate({
                left: -$('#menu').width()
            }, menuAnimTime);
            $('#menu-top').animate({
                left: -$('#menu').width() + $('#topbar').outerHeight()
            }, menuAnimTime);
            $('main').animate({
                marginLeft: 0
            }, menuAnimTime);
            $('#menu').prop('visible', false);
        }
    });
});
