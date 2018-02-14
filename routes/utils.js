module.exports = {
    checkReqs: function(courses, reqs) {
        var numReqs = reqs[0];
        for (let req of reqs.slice(1)) {
            console.log(req);
        }
    }
};
