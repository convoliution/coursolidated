var majors = require('./data/majors.json');
var minors = require('./data/minors.json');
var colleges = require('./data/colleges.json');
var courses = require('./data/courses.json');

module.exports = {
    courseCard: function(course, isCompressed=false, isDisabled=false) {
        var courseInfo = courses[course];

        // if course info isn't in our system yet, just return COGS120
        if (typeof courseInfo === 'undefined') {
            courseInfo = courses["COGS120"];
        }

        return "<div class=\"course" + (isCompressed ? " compressed" : "") + (isDisabled ? " disabled" : "") + "\" data-course=\"" + course + "\">\n"
             +     "<div class=\"course-department\">"  + courseInfo.department + "</div>\n"
             +     "<div class=\"course-code\">"        + courseInfo.code       + "</div>\n"
             +     "<div class=\"course-offered\">\n"
             +         "<div class=\"course-offered-f course-offered-term"  + (courseInfo.offered.includes('f')  ? " offered" : "") + "\" data-term=\"f\">f</div>\n"
             +         "<div class=\"course-offered-w course-offered-term"  + (courseInfo.offered.includes('w')  ? " offered" : "") + "\" data-term=\"w\">w</div>\n"
             +         "<div class=\"course-offered-s course-offered-term"  + (courseInfo.offered.includes('s')  ? " offered" : "") + "\" data-term=\"s\">s</div>\n"
             +         "<div class=\"course-offered-s1 course-offered-term" + (courseInfo.offered.includes('s1') ? " offered" : "") + "\" data-term=\"s1\">s1</div>\n"
             +         "<div class=\"course-offered-s2 course-offered-term" + (courseInfo.offered.includes('s2') ? " offered" : "") + "\" data-term=\"s2\">s2</div>\n"
             +     "</div>\n"
             + "</div>\n";
    }
};
