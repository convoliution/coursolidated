$(function() {
    // hide jQuery Mobile loading msg
    $.mobile.loading().hide();
});

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
    var course = $(this).data('course');
    $.get('/schedule-course-info/'+course, function(result) {
        var html = "";
        if (result.unmetReqs.length > 0) {
            html += "The following prerequisites have not been met:\n"
            html += result.unmetReqs.slice(1);
        } else {
            html += "Prerequisites have been met!";
        }

        $('#course-info').html(html);
        $('#course-info').dialog('open');
        $('#course-info').dialog({
            title: course
        });
    });
}

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
            ui.item.tap(showCourseInfoDialog);
            populateToadd();
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
        populateToadd();
        setTimeout(function() {// hide main menu to work around clipping bug
            $('#main-menu').css('left', -menu.outerWidth());
        }, 500);
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
    } else if (menu.attr('id') === 'toadd-menu') { // show main menu (for clipping bug)
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

function populateToadd() {
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
    $('.menu-content > .choice > button.confirm').tap(function(event) {
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
                              +     "<li>" + result + "</li>\n"
                              + "</ul>"
                        break;
                    case "college":
                        html += "You are in " + result + " College";
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
                              +     "<li>" + result + "</li>\n"
                              + "</ul>"
                        list.children('ul').append(html);
                        break;
                    case "college":
                        html += "You are in " + result + " College";
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
        });
    });
});

// Array.prototype.includes polyfill
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}
