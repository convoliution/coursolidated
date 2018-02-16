$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

// menu show/hide
$(function() {
    let animTime = 250;

    $('#topbar > button').tap(function(event) {
        event.preventDefault();
        showMenu($('#main-menu'), animTime);
    });
    $('.menu-top > button').tap(function(event) {
        event.preventDefault();
        let menu = $("#" + $(this).parent().parent().attr('id'));
        hideMenu(menu, animTime);
    });
    $('#main-menu > .menu-content > button').tap(function(event) {
        event.preventDefault();
        let menu = $("#" + $(this).text().replace(/\s/g, '').toLowerCase() + "-menu");
        showMenu(menu, animTime);
    });
});
function showMenu(menu, animTime) {
    if (menu.attr('id') === 'main-menu') {
        $('main').animate({
            marginLeft: menu.outerWidth()
        }, animTime);
        $('.term > .course').addClass('compressed');
        $('#tabs').animate({
            marginLeft: menu.outerWidth() - $('#topbar').outerHeight()
        }, animTime);
    } else if (menu.attr('id') === 'toadd-menu') {
        $.get('/populate-toadd', function(result) {
            $('#toadd-menu > .menu-content').html(result);
            $('#toadd-menu .requirement-courses').sortable({
                cancel: ".requirement",
                connectWith: ".term:not(.full)",
                tolerance: "pointer",
                revert: 100
            });
        });
    }
    menu.animate({
        left: 0
    }, animTime);
    menu.prop('visible', true);
}
function hideMenu(menu, animTime) {
    if (menu.attr('id') === 'main-menu') {
        $('main').animate({
            marginLeft: 0
        }, animTime);
        $('.term > .course').removeClass('compressed');
        $('#tabs').animate({
            marginLeft: 0
        }, animTime);
    }
    if (menu.data('activeChoice') != null) { // deactivate active choice
        menu.data('activeChoice').removeClass('active');
        menu.data('activeChoice', null);
    }
    menu.animate({
        left: -menu.outerWidth()
    }, animTime);
    menu.prop('visible', false);
}

// submenu buttons
$(function() {
    $('.menu-content > .choice > button.name').tap(function(event) {
        event.preventDefault();
        let menu = $(this).parents('.menu').first();
        if (menu.data('activeChoice') != null) {                  // if some choice is active,
            menu.data('activeChoice').removeClass('active');      // deactivate
            if (menu.data('activeChoice').is($(this).parent())) { // if that choice was this one,
                menu.data('activeChoice', null);                  // no choices are active now
                return;                                           // and we're done
            }
        }
        menu.data('activeChoice', $(this).parent());
        menu.data('activeChoice').addClass('active');
    });
});
