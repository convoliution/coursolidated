utils = {
    // returns requirements that have not been met
    unmetReqs: function(coursesTakenSet, reqs) {
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
    },
    // returns Boolean indicating whether requirements have been met
    isReqsMet: function(coursesTakenSet, reqs) {
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
};
