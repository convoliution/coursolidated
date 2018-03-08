var record = require('../data/users.json')['Ian Drosos'].majors;

exports.time = function(req, res) {
    var time = req.body.time;
    record.push(time);
    res.send("success");
};

exports.get = function(req, res) {
    res.send(record);
};
