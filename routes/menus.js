var users = require('../data/users.json');
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');
var colleges = require('../data/colleges.json');

exports.getProfile = function(req, res) {
    var userName = req.params.userName;
    var data = {
        "major": [],
        "minor": [],
        "college": ""
    };

    for (let major of users[userName].majors) {
        data.major.push(majors[major].name);
    }
    for (let minor of users[userName].minors) {
        data.minor.push(minors[minor].name);
    }
    data.college = users[userName].college;

    res.json(data);
};

exports.getMajors = function(req, res) {
    var userName = req.params.userName;
    var data = {
        "items": []
    };

    for (let majorID in majors) {
        if (!users[userName].majors.includes(majorID)) {
            data.items.push([majorID, majors[majorID].name]);
        }
    }

    res.json(data);
};

exports.getMinors = function(req, res) {
    var userName = req.params.userName;
    var data = {
        "items": []
    };

    for (let minorID in minors) {
        if (!users[userName].minors.includes(minorID)) {
            data.items.push([minorID, minors[minorID].name]);
        }
    }

    res.json(data);
};

exports.getColleges = function(req, res) {
    var userName = req.params.userName;
    var data = {
        "items": []
    };

    for (let college in colleges) {
        if (users[userName].college !== college) {
            data.items.push(college);
        }
    }

    res.json(data);
};
