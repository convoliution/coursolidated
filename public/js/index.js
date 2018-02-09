$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

// menu animation
$(function() {
    let animTime = 250;
    $('.menu-top > button').tap(function() {
        let menuID = "#" + $(this).parent().parent().attr('id');
        if (!$(menuID).prop('visible')) {
            showMenu(menuID, animTime);
        } else {
            hideMenu(menuID, animTime);
        }
    });
    $('#main-menu > .menu-content > button').tap(function() {
        let menuID = "#" + $(this).text().replace(/\s/g, '').toLowerCase() + "-menu";
        showMenu(menuID, animTime);
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
        $('#main-menu > .menu-top > button').text('<');
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
        $('#main-menu > .menu-top > button').text('>');
    } else {
        $(menuID).animate({
            left: -$(menuID).width()
        }, animTime);
    }
    $(menuID).prop('visible', false);
}
