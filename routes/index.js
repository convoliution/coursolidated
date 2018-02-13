
/*
 * GET home page.
 */
var data = {
    "user": require('../data/users.json')['Ian Drosos'],
    "majors": require('../data/majors.json'),
    "minors": require('../data/minors.json'),
    "colleges": require('../data/colleges.json'),
    "courses": require('../data/courses.json')
}

exports.view = function(req, res){
    console.log("data keys: " + Object.keys(data));
    res.render('index', data);
};
