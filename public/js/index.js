$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

// schedules
$(function() {
    setCardOutlineColors();
    $('.schedule .course').each(setCardTermColors);

    $('.term').sortable({
        connectWith: ".term:not(.full)",
        tolerance: "pointer",
        revert: 100,
        receive: function(event, ui) {
            updateUserData(this, setCardOutlineColors);
            setCardTermColors.apply(ui.item);
            if ($(this).children().length >= 6) {
                $(this).addClass('full');
            }
        },
        remove: function(event, ui) {
            updateUserData(this);
            if ($(this).children().length < 6) {
                $(this).removeClass('full');
            }
        },
    });

    function updateUserData(termElem, callback) {
        var newCourses = {
            "userName": "Ian Drosos",
            "scheduleName": "My Schedule",
            "yearName": $(termElem).siblings('.year-label').text(),
            "termId": $(termElem).data('term'),
            "courses": $(termElem).children().map(function() {
                return $(this).data('course');
            }).get()
        }
        $.post('/schedule-change', newCourses, callback);
    }

    function setCardOutlineColors() {
        var userName = "Ian Drosos";
        var scheduleName = "My Schedule";
        $.get('/schedule-check/'+userName+'/'+scheduleName, function(result) {
            var years = result[scheduleName];
            for (let year in years) {
                for (let term in years[year]) {
                    for (let course in years[year][term]) {
                        let courseCard = $('.year').filter(function() {
                            return $(this).data('year') === year;
                        }).children('.term').filter(function() {
                            return $(this).data('term') === term;
                        }).children('.course').filter(function() {
                            return $(this).data('course') === course;
                        })
                        if (years[year][term][course]) {
                            courseCard.css('border-color', 'green');
                        } else {
                            courseCard.css('border-color', 'red');
                        }
                    }
                }
            }
        });
    }

    // only apply this to things; do not call on its own
    function setCardTermColors() {
        var parentTerm = $(this).parent('.term').data('term');
        var termsOffered = $(this).find('.course-offered > .offered').map(function() {
            return $(this).data('term');
        }).get();
        if (!termsOffered.includes(parentTerm)) {
            $(this).find('.course-offered > .offered').css('color', 'red');
        } else {
            // restore to default
            $(this).find('.course-offered > .offered').css('color', '');
        }
    }
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
                items: ".course:not(.disabled)",
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
