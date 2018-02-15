var user = require('../data/users.json')['Ian Drosos'];
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');
var colleges = require('../data/colleges.json');
var courses = require('../data/courses.json');

exports.course = function(req, res){
    var course = req.query.course;
    var term = req.query.term;
    console.log("requested course: " + course);
    console.log("requested term: " + term);

    var courseInfo = courses[course]
    var reqUpperDiv = courseInfo.reqUpperDiv;
    var reqCourses = courseInfo.requirements;
    var reqTerms = courseInfo.offered;
};
// make sure data is saved afterward
