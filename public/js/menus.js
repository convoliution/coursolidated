$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

// menu show/hide
$(function() {
    let animTime = 250;

    $('#topbar > button').tap(function(event) {
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
        $('#tabs').animate({
            marginLeft: menu.outerWidth() - $('#topbar').outerHeight()
        }, animTime);
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

    $('.menu .confirm').tap(function(event) {
        event.preventDefault();
        var menuType = $(this).parents('.menu').attr('id').split('-')[0].slice(0, -1); // slice to get rid of plural 's'
        var toAdd = {
            "code": $(this).prev('.name').data('code')
        }
        $.post('/plan-'+menuType, toAdd, function(result) {
            // add to user profile
            var html = ""
            var list = $('#user-'+menuType); // list of relevant things in profile
            if (!/\S/.test(list.html())) { // if html is empty
                switch(menuType) {
                    case "major":
                    case "minor":
                        html += "You are " + menuType + "ing in:\n"
                              + "<ul>\n"
                              +     "<li>" + toAdd.code + "</li>\n"
                              + "</ul>"
                        break;
                    case "college":
                        html += "You are in " + toAdd.code + " College";
                        break;
                    default:
                        throw "invalid user attribute " + menuType;
                }
                list.html(html);
            } else {
                switch(menuType) {
                    case "major":
                    case "minor":
                        html += "<ul>\n"
                              +     "<li>" + toAdd.code + "</li>\n"
                              + "</ul>"
                        list.children('ul').append(html);
                        break;
                    case "college":
                        html += "You are in " + toAdd.code + " College";
                        list.html(html);
                        break;
                    default:
                        throw "invalid user attribute " + menuType;
                }
            }

            // show confirmation
            $('#'+menuType+'s-menu > .menu-content > .choice > button.name').filter(function() {
                return $(this).data('code') === toAdd.code;
            }).next('button.confirm').text('You got it!');

            // append new courses to To Add

            // does not work the way it should
            for (let course of result.html) {
                $('#toadd-menu .requirement').append(course);
            }
        });
    });
});
