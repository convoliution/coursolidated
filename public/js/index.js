// menu animation
$(function() {
    let menuAnimTime = 250;
    $('#menu-top > button').tap(function() {
        menuID = '#main-menu';
        if (!$(menuID).prop('visible')) {
            showMenu(menuID);
        } else {
            hideMenu(menuID);
        }
    });

    function showMenu(menuID) {
        $(menuID).animate({
            left: 0
        }, menuAnimTime);
        $('main').animate({
            marginLeft: $(menuID).width()
        }, menuAnimTime);
        if (menuID === '#main-menu') {
            $('#menu-top').animate({
                left: 0
            }, menuAnimTime);
        }
        $(menuID).prop('visible', true);
    }
    function hideMenu(menuID) {
        $(menuID).animate({
            left: -$(menuID).width()
        }, menuAnimTime);
        $('main').animate({
            marginLeft: 0
        }, menuAnimTime);
        if (menuID === '#main-menu') {
            $('#menu-top').animate({
                left: -$(menuID).width() + $('#topbar').outerHeight()
            }, menuAnimTime);
        }
        $(menuID).prop('visible', false);
    }
});
