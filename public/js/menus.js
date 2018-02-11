$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

// menu animation
$(function() {
    let animTime = 250;
    $('#topbar > button').tap(function(event) {
        showMenu('#main-menu', animTime);
    });
    $('.menu-top > button').tap(function(event) {
        event.preventDefault();
        let menuID = "#" + $(this).parent().parent().attr('id');
        hideMenu(menuID, animTime);
    });
    $('#main-menu > .menu-content > button').tap(function(event) {
        event.preventDefault();
        let menuID = "#" + $(this).text().replace(/\s/g, '').toLowerCase() + "-menu";
        showMenu(menuID, animTime);
    });
});
function showMenu(menuID, animTime) {
    if (menuID === '#main-menu') {
        $('main').animate({
            marginLeft: $(menuID).outerWidth()
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
            marginLeft: 0
        }, animTime);
    }
    $(menuID).animate({
        left: -$(menuID).outerWidth()
    }, animTime);
    $(menuID).prop('visible', false);
}
