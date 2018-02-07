// menu animation
$(function() {
    var menuAnimTime = 250;
    $('#topbar > button').prop('visible', false);
    $('#topbar > button').tap(function() {
        var menuWidth = $('#menu').width();
        if (!$('#topbar > button').prop('visible')) {
            $('#menu').animate({
                left: 0
            }, menuAnimTime);
            $('main').animate({
                marginLeft: menuWidth
            }, menuAnimTime);
            $('#topbar > button').prop('visible', true);
        } else {
            $('#menu').animate({
                left: -menuWidth
            }, menuAnimTime);
            $('main').animate({
                marginLeft: 0
            }, menuAnimTime);
            $('#topbar > button').prop('visible', false);
        }
    });
});
