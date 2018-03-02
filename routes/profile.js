var user = require('../data/users.json')['Ian Drosos'];
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');

exports.getInfo = function(req, res) {
    data = {
        "major": [],
        "minor": [],
        "college": ""
    }

    for (let major of user.majors) {
        data.major.push(majors[major].name);
    }
    for (let minor of user.minors) {
        data.minor.push(minors[minor].name);
    }
    data.college = user.college;

    res.json(data);
}
