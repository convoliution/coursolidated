$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

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
        if (menuID === '#main-menu') {
            $('main').animate({
                marginLeft: $(menuID).width()
            }, menuAnimTime);
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
        if (menuID === '#main-menu') {
            $('main').animate({
                marginLeft: 0
            }, menuAnimTime);
            $('#menu-top').animate({
                left: -$(menuID).width() + $('#topbar').outerHeight()
            }, menuAnimTime);
        }
        $(menuID).prop('visible', false);
    }
});
