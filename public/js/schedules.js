// shoddy, fake, and unconvicing login menu
$(function() {
    $('#login').dialog({
        autoOpen: true,
        closeText: "Login"
    });
    $('.ui-dialog').css({
        'height': '8rem',
        'width': '16rem',
        'background-color': 'white',
        'border': '2px solid black',
        'padding': '.5rem'
    });
    $('.ui-dialog-titlebar').css({
        'background-color': 'gray',
        'border-radius': '4px'
    });
});

$(function() {
    setCardStatuses();

    $('.term').sortable({
        connectWith: ".term:not(.full)",
        tolerance: "pointer",
        revert: 100,
        receive: function(event, ui) {
            updateUserData(this, setCardStatuses);
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
    $('#toadd-menu .requirement').sortable({
        connectWith: ".term:not(.full)",
        tolerance: "pointer",
        revert: 100
        // resize card on grab
    });

    function updateUserData(termElem, callback) {
        newCourses = {
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

    function setCardStatuses() {
        userName = "Ian Drosos";
        scheduleName = "My Schedule";
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
});
