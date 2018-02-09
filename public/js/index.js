$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

// menu animation
$(function() {
    $('.menu-top > button').tap(function() {
        let animTime = 250;
        let menuID = "#" + $(this).parent().parent().attr('id');
        console.log(menuID);
        if (!$(menuID).prop('visible')) {
            showMenu(menuID, animTime);
        } else {
            hideMenu(menuID, animTime);
        }
    });
    $('#main-menu > .menu-content > button').tap(function() {
        console.log($(this).text());
    });
});
function showMenu(menuID, animTime) {
    if (menuID === '#main-menu') {
        $('main').animate({
            marginLeft: $(menuID).width()
        }, animTime);
        $('#main-menu > .menu-content').animate({
            width: $(menuID).width()
        }, animTime);
    }
    $(menuID).animate({
        left: 0
    }, animTime);
    $(menuID).prop('visible', true);
}
function hideMenu(menuID, animTime) {
    if (menuID === '#main-menu') {
        $('main').animate({
            marginLeft: $('#topbar').outerHeight()
        }, animTime);
        $('#main-menu').animate({
            left: -$(menuID).width() + $('#topbar').outerHeight()
        }, animTime);
        $('#main-menu > .menu-content').animate({
            width: $(menuID).width() - $('#topbar').outerHeight()
        }, animTime);
    } else {
        $(menuID).animate({
            left: -$(menuID).width()
        }, animTime);
    }
    $(menuID).prop('visible', false);
}
