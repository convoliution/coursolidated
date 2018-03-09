$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

const ANIM_TIME = 250;
const USER_NAME = Math.floor(Math.random()*Math.pow(10, 20)).toString();
$.post('/users-new', {'userName':USER_NAME}, function(result) {
    console.log("Null data initialized. Good luck with using the app.")
});

var startTime;
$(function() {
    startTime = Date.now();
});
var firstCourse = true;
function recordEndTime() {
    gtag('event', 'add', {
        'event_category': 'first_course',
        'event_label': (Date.now() - startTime).toString()+"A"
    });
    firstCourse = false;
}

// login dialog
$(function() {
    $('#login').dialog({
        title: "Log In",
        draggable: false,
        modal: true,
        resizable: false,
        classes: {
            "ui-dialog": "login-dialog"
        }
    });
    $('.ui-dialog.login-dialog').css({
        "z-index": "4",
        "background-color": "white",
        "border": "4px solid black",
        "border-radius": "4px"
    });
    $('.ui-dialog.login-dialog .ui-dialog-titlebar-close').css({
        "display": "none"
    });
    $('#login > button').tap(function(event) {
        event.preventDefault();
        $('#login').dialog("close");
    });
});
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
function statusChangeCallback(response) {
    $('#login').dialog("close");
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log('Successfully logged in with Facebook');
    }
}

$(function() {
    let counter = 0;
    var scheduleName = "My Schedule";
        $.get('/schedule-check/'+USER_NAME+'/'+scheduleName, function(result) {
            var years = result[scheduleName];
            for (let year in years) {
                for (let term in years[year]) {
                    for (let course in years[year][term]) {
                        counter++;
                    }
                }
            }
        });

    if (counter == 0)
    {
        showMenu($("#main-menu"), ANIM_TIME);
    }
});

// course info
$(function() {
    $('#course-info').dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        resizable: false,
        classes: {
            "ui-dialog": "course-info-dialog"
        }
    });
    $('.ui-dialog.course-info-dialog').css({
        "z-index": "4",
        "background-color": "white",
        "border": "4px solid black",
        "border-radius": "4px"
    });
    $('.ui-dialog.course-info-dialog .ui-dialog-titlebar-close').css({
        "float": "right"
    });
    $('.schedule .course').tap(showCourseInfoDialog);
});

function showCourseInfoDialog(event) {
    event.preventDefault();
    var courseCard = this;
    var course = $(this).data('course');
    $.get('/schedule-course-info/'+USER_NAME+'/'+course, function(result) {
        var html = "";
        if (result.unmetReqs.length > 0) {
            html += "The following prerequisites have not been met:\n"
            html += result.unmetReqs.slice(1);
        } else {
            html += "Prerequisites have been met!";
        }

        $('#course-info').html(html);
        //append a button
        $('#course-info').append("<button class=\"delete\">Delete Course</button>");
        $('#course-info > button.delete').tap(function(event) {
            event.preventDefault();
            // delete the class and send the parent term div to server
            var term = $(courseCard).parent();
            updateReqs(course, 'removed');
            $(courseCard).remove();
            updateUserData(term, populateReqs);
            $('#course-info').dialog('close');
        });
        $('#course-info').dialog('open');
        $('#course-info').dialog({
            title: course
        });
    });
}

function updateUserData(termElem, callback) {
    var newCourses = {
        "userName": USER_NAME,
        "scheduleName": "My Schedule",
        "yearName": $(termElem).siblings('.year-label').text(),
        "termId": $(termElem).data('term'),
        "courses": $(termElem).children().map(function() {
            return $(this).data('course');
        }).get()
    }
    $.post('/schedule-change', newCourses, function(result) {
        if (callback){
            callback();
        }
        setCardOutlineColors();
    });
}

function setCardOutlineColors() {
    var scheduleName = "My Schedule";
    $.get('/schedule-check/'+USER_NAME+'/'+scheduleName, function(result) {
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

// schedules
$(function() {
    setCardOutlineColors();
    $('.schedule .course').each(setCardTermColors);
    $('.term').sortable({
        connectWith: ".term:not(.full), .requirement-courses, .catalog-courses",
        tolerance: "pointer",
        placeholder: "no-placeholder",
        receive: function(event, ui) {
            if (firstCourse) {
                recordEndTime();
            }
            if (ui.sender.hasClass('requirement-courses') || ui.sender.hasClass('catalog-courses')) {
                ui.sender.data('copyComplete', true);
            }
            updateUserData(this);
            setCardTermColors.apply(ui.item);
            ui.item.tap(showCourseInfoDialog);
            updateReqs(ui.item.data('course'), 'added');
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
    $('#topbar > button').tap(function(event) {
        event.preventDefault();
        showMenu($('#main-menu'), ANIM_TIME);
    });
    $('.menu-top > button').tap(function(event) {
        event.preventDefault();
        let menuID = "#" + $(this).parent().parent().attr('id');
        hideMenu($(menuID), ANIM_TIME);
    });
    $('#main-menu > .menu-content > button').tap(function(event) {
        event.preventDefault();
        let menuID = "#" + $(this).text().replace(/\s/g, '').toLowerCase() + "-menu";
        showMenu($(menuID), ANIM_TIME);
    });
});

function showMenu(menu, animTime) {
    if (menu.attr('id') === 'main-menu') {
        $('main').animate({
            marginLeft: menu.outerWidth()
        }, animTime);
        $('.term > .course').addClass('compressed');
        $('#coursolidated').animate({
            marginLeft: menu.outerWidth() - $('#topbar').outerHeight()
        }, animTime);
    } else if (['catalog-menu', 'reqs-menu'].includes(menu.attr('id'))) {
        setTimeout(function() {// hide main menu to work around clipping bug
            $('#main-menu').css('left', -menu.outerWidth());
        }, 500);
    } else if (menu.attr('id') === 'profile-menu') {
        populateProfile();
    } else if (['majors-menu', 'minors-menu', 'colleges-menu'].includes(menu.attr('id'))) {
        populateMajMinCol(menu);
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
        $('#coursolidated').animate({
            marginLeft: 0
        }, animTime);
    } else if (['catalog-menu', 'reqs-menu'].includes(menu.attr('id'))) { // show main menu (for clipping bug)
        $('#main-menu').css('left', 0);
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

function populateMajMinCol(menu) {
    $.get('/'+menu.attr('id')+'/'+USER_NAME, function(result) {
        var menuContent = menu.children('.menu-content').first(); // first and only

        var html = "";
        if (['majors-menu', 'minors-menu'].includes(menu.attr('id'))) {
            for (let item of result.items) {
                html += "<div class=\"choice\">"
                      +     "<button class=\"name\" data-code=\"" + item[0] + "\">" + item[1] + "</button>"
                      +     "<button class=\"confirm\">Add</button>"
                      + "</div>";
            }
        } else { // colleges-menu
            for (let item of result.items) {
                html += "<div class=\"choice\">"
                      +     "<button class=\"name\" data-code=\"" + item + "\">" + item + "</button>"
                      +     "<button class=\"confirm\">Add</button>"
                      + "</div>";
            }
        }

        menuContent.html(html);
        activateMenuButtons(menu.attr('id'));
    })
}

function populateProfile() {
    $.get('/profile-menu/'+USER_NAME, function(result) {
        for (let menuType in result) {
            var html = "";
            if (result[menuType].length) {
                if (menuType === "major" || menuType === "minor") {
                    html += "You are " + menuType + "ing in:\n"
                          + "<ul>\n";
                    for (let item of result[menuType]) {
                        html += "<li>" + item + "</li>\n";
                    }
                    html +=     "<li class=\"add\">+ add "+menuType+"</li>\n"
                          + "</ul>\n";
                } else if (menuType === "college") {
                    html += "You are in:\n"
                          + "<ul>\n"
                          +     "<li>" + result[menuType] + "</li>\n"
                          + "</ul>\n";
                }
            } else {
                html += "<ul>\n"
                      +     "<li class=\"add\">+ add "+menuType+"</li>\n"
                      + "</ul>\n"
            }
            $('#user-'+menuType).html(html);
        }
        $('#profile-menu > .menu-content > .user-attribute > ul > li.add').tap(function(event) {
            event.preventDefault();
            var menuID = "#" + $(this).parent('ul').parent('.user-attribute').attr('id').split('-')[1] + "s-menu";
            showMenu($(menuID), ANIM_TIME);
        });
    });
}

$(function() {
    $('#catalog-menu .catalog-courses').sortable({
        items: ".course:not(.disabled)",
        connectWith: ".term:not(.full)",
        tolerance: "pointer",
        placeholder: "no-placeholder",
        helper: function(event, item) {
            this.copyHelper = item.clone().insertAfter(item);
            $(this).data('copyComplete', false);
            return item.clone();
        },
        stop: function(event, ui) {
            if (!$(this).data('copyComplete')) {
                this.copyHelper.remove();
            }
            this.copyHelper = null;
        },
        receive: function(event, ui){
            $(ui.item).remove();
            updateUserData($(ui.sender), function(result){
                updateReqs(ui.item.data('course'), 'removed');
            });
        }
    });
});

function populateReqs() {
    $.get('/populate-reqs/'+USER_NAME, function(result) {
        $('#reqs-menu > .menu-content').html(result);
        $('#reqs-menu .requirement-courses').sortable({
            items: ".course:not(.disabled)",
            connectWith: ".term:not(.full)",
            tolerance: "pointer",
            placeholder: "no-placeholder",
            helper: function(event, item) {
                this.copyHelper = item.clone().insertAfter(item);
                $(this).data('copyComplete', false);
                return item.clone();
            },
            stop: function(event, ui) {
                if (!$(this).data('copyComplete')) {
                    this.copyHelper.remove();
                }
                this.copyHelper = null;
            },
            receive: function(event, ui){
                $(ui.item).remove();
                updateUserData($(ui.sender), function(result){
                    updateReqs(ui.item.data('course'), 'removed');
                });
            }
        });
    });
}

function updateReqs(course, action) {
    if (action === 'added') {
        $('#reqs-menu .course').filter(function() {
            return $(this).data('course') === course;
        }).addClass('disabled');
    } else if (action === 'removed') {
        $('#reqs-menu .course').filter(function() {
            return $(this).data('course') === course;
        }).removeClass('disabled');
    } else {
        throw new TypeError("invalid action '"+action+"', only actions allowed are 'added' and 'removed'");
    }
}

// submenu buttons
function activateMenuButtons(menuID) {
    $('#'+menuID+' > .menu-content > .choice > button.name').tap(function(event) {
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
    $('#'+menuID+' > .menu-content > .choice > button.confirm').tap(function(event) {
        event.preventDefault();
        var menuType = $(this).parents('.menu').attr('id').split('-')[0].slice(0, -1); // slice to get rid of plural 's'
        var toAdd = {
            "userName": USER_NAME,
            "code": $(this).prev('.name').data('code'),
            "name": $(this).prev('.name').text()
        }
        $.post('/plan-'+menuType, toAdd, function(result) {
            // show confirmation
            $('#'+menuType+'s-menu > .menu-content > .choice > button.name').filter(function() {
                return $(this).data('code') === toAdd.code;
            }).next('button.confirm').animate({
                backgroundColor: '#ffffff'
            }, 150);
            populateProfile();
            setTimeout(function() {
                // automatically retract menu
                hideMenu($('#'+menuType+'s-menu'), ANIM_TIME);
                // flash added item
                var newItem = $('#profile-menu > .menu-content li').filter(function() {
                    return $(this).text() === toAdd.name;
                });
                var origBgColor = newItem.css('background-color');
                newItem.css('background-color', 'lightgreen');
                setTimeout(function() {
                    newItem.animate({
                        backgroundColor: origBgColor
                    }, 250);
                }, 250);
            }, 150);
            populateReqs();
        });
    });
}
