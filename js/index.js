// menu animation
$(function() {
    var menuWidth = '16rem';
    var menuAnimTime = 250;
    $('#topbar > button').prop('visible', false);
    $('#topbar > button').tap(function() {
        if (!$('#topbar > button').prop('visible')) {
            $('#menu').animate({
                width: menuWidth
            }, menuAnimTime);
            $('main').animate({
                marginLeft: menuWidth
            }, menuAnimTime);
            $('#topbar > button').prop('visible', true);
        } else {
            $('#menu').animate({
                width: 0
            }, menuAnimTime);
            $('main').animate({
                marginLeft: 0
            }, menuAnimTime);
            $('#topbar > button').prop('visible', false);
        }
    });
});
