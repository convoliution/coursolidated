var user = require('../data/users.json')['Ian Drosos'];
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');
var colleges = require('../data/colleges.json');

exports.getProfile = function(req, res) {
    data = {
        "major": [],
        "minor": [],
        "college": ""
    };

    for (let major of user.majors) {
        data.major.push(majors[major].name);
    }
    for (let minor of user.minors) {
        data.minor.push(minors[minor].name);
    }
    data.college = user.college;

    res.json(data);
}

exports.getMajors = function(req, res) {
    data = {
        "items": []
    };

    for (let majorID in majors) {
        if (!user.majors.includes(majorID)) {
            data.items.push([majorID, majors[majorID].name]);
        }
    }

    res.json(data);
}

exports.getMinors = function(req, res) {
    data = {
        "items": []
    };

    for (let minorID in minors) {
        if (!user.minors.includes(minorID)) {
            data.items.push([minorID, minors[minorID].name]);
        }
    }

    res.json(data);
}

exports.getColleges = function(req, res) {
    data = {
        "items": []
    };

    for (let college in colleges) {
        if (user.college !== college) {
            data.items.push(college);
        }
    }

    res.json(data);
}
