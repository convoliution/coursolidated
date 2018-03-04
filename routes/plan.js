var users = require('../data/users.json');
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');
var colleges = require('../data/colleges.json');
var courses = require('../data/courses.json');

var templates = require('../templates');

exports.major = function(req, res){
    var userName = req.body.userName;
    var major = req.body.code;

    console.log("requested major: " + major);

    users[userName].majors.push(major);

    res.send(majors[major].name);
};

exports.minor = function(req, res){
    var userName = req.body.userName;
    var minor = req.body.code;

    console.log("requested minor: " + minor);

    users[userName].minors.push(minor);

    res.send(minors[minor].name);
};

exports.college = function(req, res){
    var userName = req.body.userName;
    var college = req.body.code;

    console.log("requested college: " + college);

    users[userName].college = college;

    res.send(college);
};
