var user = require('../data/users.json')['Ian Drosos'];
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');
var colleges = require('../data/colleges.json');
var courses = require('../data/courses.json');

var templates = require('../templates');

exports.major = function(req, res){
    var major = req.body.code;
    console.log("requested major: " + major);
    if (user.majors.includes(major)) {
        // notify user major already exists
    } else {
        user.majors.push(major);
        // notify user of addition of major
    }
};

exports.minor = function(req, res){
    var minor = req.body.code;
    console.log("requested minor: " + minor);
    if (user.minors.includes(minor)) {
        // notify user major already exists
    } else {
        user.minors.push(minor);
        // notify user of addition of major
    }
};

exports.college = function(req, res){
    var college = req.body.code;
    console.log("requested college: " + college);
    // if no college
    // if college already exists
};

exports.course = function(req, res){
    var course = req.body.code;
    console.log("requested course: " + course);
};

// make sure data is saved afterward
