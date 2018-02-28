var user = require('../data/users.json')['Ian Drosos'];
var majors = require('../data/majors.json');
var minors = require('../data/minors.json');
var colleges = require('../data/colleges.json');

var templates = require('../templates');
var utils = require('../utils');

exports.populate = function(req, res) {
    var coursesToAdd = getCoursesToAdd();

    var html = "";

    for (let set of coursesToAdd) {
        html += createSet(set);
    }

    res.send(html);
}

function getCoursesToAdd() {
    var userMajors = user.majors;
    var userMinors = user.minors;
    var userCollege = user.college;

    var allFirstAppears = utils.allFirstAppears();

    var toAdds = [];

    for (let major of userMajors) {
        let reqName = majors[major].name + " major";
        let reqs = majors[major].requirements;
        toAdds.push({ [reqName]: areReqsMet(reqs, allFirstAppears) });
    }

    for (let minor of userMinors) {
        let reqName = minors[minor].name + " minor";
        let reqs = minors[minor].requirements;
        toAdds.push({ [reqName]: areReqsMet(reqs, allFirstAppears) });
    }

    if (userCollege.length > 0) {
        let reqName = userCollege + " college";
        let reqs = colleges[userCollege].requirements;
        toAdds.push({ [reqName]: areReqsMet(reqs, allFirstAppears) });
    }

    return toAdds;
}

function areReqsMet(reqs, allFirstAppears) {
    // courses become keys in one-pair dictionaries
    // if that course is not on the schedule, its value is false
    // if it is on the schedule, its value is the year+term in which it first appears
    var ret = [];
    ret[0] = reqs[0];

    for (let i = 1; i < reqs.length; i++) {
        if (reqs[i].constructor === Array) {
            ret[i] = areReqsMet(reqs[i], allFirstAppears);
        } else {
            let firstAppears = allFirstAppears[reqs[i]]
            ret[i] = {
                [reqs[i]]: ((typeof firstAppears === 'undefined') ? false : firstAppears)
            }
        }
    }
    return ret;
}

function createSet(set) {
    let setName = Object.keys(set)[0]; // there should only be one key
    let setReq = set[setName];

    return "<div class=\"set\">\n"
         +     "<div class=\"set-label\">" + setName + "</div>\n"
         +     createRequirement(setReq)
         + "</div>\n";
}

function createRequirement(req) {
    if (req.length === 0) {
        return "";
    }

    var reqLabel = "choose&nbsp;" + ((req[0] === 0) ? "all" : req[0].toString()) + ":";

    html  = "<div class=\"requirement\">\n"
          +     "<div class=\"requirement-label\">" + reqLabel + "</div>\n"
          +     "<div class=\"requirement-courses\">\n";

    for (let subreq of req.slice(1)) {
        if (subreq.constructor === Array) {
            html += createRequirement(subreq);
        } else {
            let course = Object.keys(subreq)[0]; // there should only be one key
            let appears = subreq[course];
            if (!appears) {
                html += templates.courseCard(course, true);
            } else {
                [year, term] = appears.split(' ');
                html += templates.disabledCourseCard(course, year, term);
            }
        }
    }

    html +=     "</div>\n"
          + "</div>\n";

    return html
}
