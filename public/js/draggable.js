$(function() {
    $('.term').sortable({
        connectWith: ".term:not(.full)",
        tolerance: "pointer",
        revert: 100,
        receive: function(event, ui) {
            if ($(this).children().length >= 6) {
                $(this).addClass('full');
            }
        },
        remove: function(event, ui) {
            if ($(this).children().length < 6) {
                $(this).removeClass('full');
            }
        }
    });
    
});
