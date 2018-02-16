$(function() {
    $('.term').sortable({
        connectWith: ".term:not(.full)",
        tolerance: "pointer",
        revert: 100,
        receive: function(event, ui) {
            if ($(this).children().length >= 6) {
                $(this).addClass('full');
            }
            updateUserData(this, setCardStatuses);
        },
        remove: function(event, ui) {
            if ($(this).children().length < 6) {
                $(this).removeClass('full');
            }
            updateUserData(this);
        },
        // check prereqs for all courses on drop
        /*deactivate: function(event, ui) {
            $(this).parents('.schedule').find('.course').map(setCardStatus);
        }*/
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
            console.log("GET success!");
        });
        /*                        // courses from prev terms in same year
        let preceedingCourses = $(this).parent().prevAll('.term').children('.course')
                                // courses from prev years
                                .add($(this).parent().parent().prevAll('.year')
                                .children('.term').children('.course')).get();
        //console.log(new Set(preceedingCourses));

        // get requirements from courses.json
        var course = $(this).data('course');*/
    }
});
