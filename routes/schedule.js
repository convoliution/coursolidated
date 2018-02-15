var user = require('../data/users.json')['Ian Drosos'];

exports.change = function(req, res) {
    userName = req.body.userName;
    scheduleName = req.body.scheduleName;
    yearName = req.body.yearName;
    termId = req.body.termId;
    courses = req.body.courses;

    var schedules = user.schedules;
    var numSchedules = schedules.length;
    for (var iSchedule = 0; iSchedule < numSchedules; iSchedule++) {
        if (schedules[iSchedule].name === scheduleName) {
            break;
        }
        if (iSchedule === numSchedules - 1) {
            throw "unable to find schedule " + scheduleName;
        }
    }
    var years = schedules[iSchedule].years;
    var numYears = years.length;
    for (var iYear = 0; iYear < numYears; iYear++) {
        if (years[iYear].name === yearName) {
            break;
        }
        if (iYear === numYears - 1) {
            throw "unable to find year " + yearName + " in schedule " + scheduleName;
        }
    }
    var terms = years[iYear].terms;
    var numTerms = terms.length;
    for (var iTerm = 0; iTerm < numTerms; iTerm++) {
        if (terms[iTerm].id === termId) {
            break;
        }
        if (iTerm === numTerms - 1) {
            throw "unable to find term " + termId + " in year " + yearName + " in schedule " + scheduleName;
        }
    }
    user.schedules[iSchedule].years[iYear].terms[iTerm].courses = courses;
    res.json(user);
};

exports.check = function(req, res) {

};

// returns requirements that have not been met
function unmetReqs(coursesTakenSet, reqs) {
    ret = reqs.slice();
    var numReqs = reqs[0];

    var i = ret.length - 1;
    while (i--) {
        if ((ret[i+1].constructor === Array && this.isReqsMet(coursesTakenSet, ret[i+1])) || coursesTakenSet.has(ret[i+1])) {
            ret.splice(i, 1);
        }
    }

    if (ret.length === 0) {
        return ret;
    } else {
        ret[0] = ret.length - 1;
        return ret;
    }
}

// returns Boolean indicating whether requirements have been met
function isReqsMet(coursesTakenSet, reqs) {
    var numReqs = reqs[0];

    for (let req of reqs.slice(1)) {
        if ((req.constructor === Array && this.isReqsMet(coursesTakenSet, req)) || coursesTakenSet.has(req)) {
            numReqs--;
            if (numReqs == 0) {
                return true;
            }
        }
    }
    return false;
}
