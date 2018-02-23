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
    res.send(majors[major].name);
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
    res.send(minors[minor].name);
};

exports.college = function(req, res){
    var college = req.body.code;
    console.log("requested college: " + college);
    if (user.college !== "") {
        // notify user he/she already has a college chosen
    } else {
        user.college = college;
        // notify user college has been set
    }
    res.send(college);
};

exports.course = function(req, res){
    var course = req.body.code;
    console.log("requested course: " + course);
};

// make sure data is saved afterward
