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
