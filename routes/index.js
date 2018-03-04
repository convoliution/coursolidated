
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
    data['viewAlt'] = false;
    res.render('index', data);
};

exports.viewAlt = function(req, res){
    data['viewAlt'] = true;
    res.render('index', data);
};
