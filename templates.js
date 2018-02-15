var user = require('./data/users.json')['Ian Drosos']
var majors = require('./data/majors.json')
var minors = require('./data/minors.json')
var colleges = require('./data/colleges.json')
var courses = require('./data/courses.json')

module.exports = {
    courseCard: function(course) {
        var courseInfo = courses[course];

        return "<div class=\"course\" data-course=\"" + course + "\">\n"
             +     "<div class=\"course-department\">"  + courseInfo.department + "</div>\n"
             +     "<div class=\"course-code\">"        + courseInfo.code       + "</div>\n"
             +     "<div class=\"course-offered\">\n"
             +         "<div class=\"course-offered-f"  + (courseInfo.offered.includes('f') ? " offered"  : "") + "\">f</div>\n"
             +         "<div class=\"course-offered-w"  + (courseInfo.offered.includes('w') ? " offered"  : "") + "\">w</div>\n"
             +         "<div class=\"course-offered-s"  + (courseInfo.offered.includes('s') ? " offered"  : "") + "\">s</div>\n"
             +         "<div class=\"course-offered-s1" + (courseInfo.offered.includes('s1')? " offered" : "") + "\">s1</div>\n"
             +         "<div class=\"course-offered-s2" + (courseInfo.offered.includes('s2')? " offered" : "") + "\">s2</div>\n"
             +     "</div>\n"
             + "</div>\n"
    },
};
