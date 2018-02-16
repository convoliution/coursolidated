var user = require('../data/users.json')['Ian Drosos'];
var courses = require('../data/courses.json');

exports.change = function(req, res) {
    var userName = req.body.userName;
    var scheduleName = req.body.scheduleName;
    var yearName = req.body.yearName;
    var termId = req.body.termId;
    var courses = req.body.courses || []; // AJAX apparetly doesn't deal with empty arrays

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
    var userName = req.params.userName;
    var scheduleName = req.params.scheduleName;

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

    isMet = {};
    isMet[scheduleName] = {};
    var years = schedules[iSchedule].years;
    var preceedingCourses = new Set();

    for (let year of years) {
        isMet[scheduleName][year.name] = {}
        for (let term of year.terms) {
            isMet[scheduleName][year.name][term.id] = {}
            for (let course of term.courses) {
                isMet[scheduleName][year.name][term.id][course] = isReqsMet(preceedingCourses, courses[course].requirements)
            }
            for (let course of term.courses) {
                preceedingCourses.add(course);
            }
        }
    }
    res.json(isMet);
};

// returns Boolean indicating whether requirements have been met
function isReqsMet(coursesTakenSet, reqs) {
    if (reqs.length === 0) {
        return true;
    }

    var numReqs = reqs[0];

    for (let req of reqs.slice(1)) {
        if ((req.constructor === Array && isReqsMet(coursesTakenSet, req)) || coursesTakenSet.has(req)) {
            numReqs--;
            if (numReqs == 0) {
                return true;
            }
        }
    }
    return false;
}

// returns requirements that have not been met
// doesn't work!
/*function unmetReqs(coursesTakenSet, reqs) {
    if (reqs.length === 0) {
        return reqs;
    }

    ret = reqs.slice();
    var numReqs = reqs[0];

    var i = ret.length - 1;
    while (i--) {
        console.log(ret[i+1]);
        if ((ret[i+1].constructor === Array && isReqsMet(coursesTakenSet, ret[i+1])) || coursesTakenSet.has(ret[i+1])) {
            ret.splice(i, 1);
            numReqs--;
            if (numReqs == 0) {
                return [];
            }
        }
    }

    if (ret.length === 1) { // if it's just [ 0 ]
        return [];
    } else {
        ret[0] = ret.length - 1;
        return ret;
    }
}*/
