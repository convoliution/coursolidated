var users = require('./data/users.json');
var majors = require('./data/majors.json');
var minors = require('./data/minors.json');
var colleges = require('./data/colleges.json');
var courses = require('./data/courses.json');

module.exports = {
    // if a course appears more than once in a schedule,
    // return the year and term of the first appearance
    // otherwise return null
    firstAppears: function(courseToFind, userName) {
        var schedule = users[userName].schedules[0];
        for (let year of schedule.years.slice().reverse()) {
            let yearName = year.name;
            for (let term of year.terms.slice().reverse()) {
                let termId = term.id;
                for (let course of term.courses.slice().reverse()) {
                    if (course === courseToFind) {
                        if (typeof whenFirstAppears === 'undefined') {
                            var whenFirstAppears = yearName + " " + termId;
                        } else {
                            return whenFirstAppears;
                        }
                    }
                }
            }
        }
        return null;
    },
    allFirstAppears: function(userName) {
        var whenAllFirstAppears = {};

        var schedule = users[userName].schedules[0];
        for (let year of schedule.years.slice().reverse()) {
            let yearName = year.name;
            for (let term of year.terms.slice().reverse()) {
                let termId = term.id;
                for (let course of term.courses.slice().reverse()) {
                    whenAllFirstAppears[course] = yearName + " " + termId;
                }
            }
        }

        return whenAllFirstAppears;
    }
};
