var user = require('../data/users.json')['Ian Drosos'];
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');
var colleges = require('../data/colleges.json');
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

exports.courseInfo = function(req, res) {
    var courseToFind = req.params.course;

    var info = {};

    var schedule = user.schedules[0]; // get first schedule because nothing matters anymore
    var preceedingCourses = new Set();

    getUnmetReqs:
    for (let year of schedule.years) {
        for (let term of year.terms) {
            for (let course of term.courses) {
                if (course === courseToFind) {
                    info['unmetReqs'] = unmetReqs(preceedingCourses, courses[course].requirements);
                    break getUnmetReqs;
                }
            }
            for (let course of term.courses) {
                preceedingCourses.add(course);
            }
            // remove courses
            // for ...{
            //    preceedingCourses.remove(course);
            //

        }
    }

    res.json(info);
};

// returns Boolean indicating whether requirements have been met
function isReqsMet(coursesTakenSet, reqs) {
    if (reqs.length === 0) {
        return true;
    }

    var numReqs = (reqs[0] === 0) ? (reqs.length - 1) : reqs[0];

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
function unmetReqs(coursesTakenSet, reqs) {
    if (reqs.length === 0) {
        return reqs;
    }

    var numReqs = (reqs[0] === 0) ? (reqs.length - 1) : reqs[0];

    ret = reqs.slice();
    for (let i = ret.length - 1; i > 0; i--) {
        if (ret[i].constructor === Array) {
            ret[i] = unmetReqs(coursesTakenSet, ret[i]);
            if (ret[i] === []) {
                ret.splice(i, 1);
                numReqs--;
            }
        } else if (coursesTakenSet.has(ret[i])) {
            ret.splice(i, 1);
            numReqs--;
        }
        if (numReqs === 0) {
            return [];
        }
    }

    ret[0] = (numReqs === (ret.length - 1)) ? 0 : numReqs;
    return ret;
}
