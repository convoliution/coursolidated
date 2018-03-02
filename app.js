
/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');
var express = require('express');
var expresshbs = require('express3-handlebars');

var app = express();

var templates = require('./templates');
var handlebars = expresshbs.create({
    helpers: {
        isEqual: function(obj1, obj2) {
            return obj1 === obj2;
        },
        isIn: function(obj, lst) {
            return lst.includes(obj);
        },
        populateTerm: function(termId, courses) {
            var termLabel = {
                'f': "fall",
				'w': "winter",
				's': "spring",
				's1': "summer I",
                's2': "summer II"
            }[termId];

            var html = "<div class=\"term-label\">" + termLabel.replace(/\s/g, '&nbsp;') + "</div>\n"
                     + "<div class=\"term " + termLabel.replace(/\s/g, '-') + "\" data-term=\"" + termId + "\">\n"
            for (let course of courses) {
                html += templates.courseCard(course);
            }
            html += "</div>"

            return html;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var index = require('./routes/index');
var plan = require('./routes/plan');
var menus = require('./routes/menus');
var add = require('./routes/add');
var schedule = require('./routes/schedule');

app.get('/', index.view);
app.get('/alt', index.viewAlt);

app.post('/plan-major', plan.major);
app.post('/plan-minor', plan.minor);
app.post('/plan-college', plan.college);
app.post('/plan-course', plan.course);

app.get('/profile-menu/:userName', menus.getProfile);
app.get('/majors-menu/:userName', menus.getMajors);
app.get('/minors-menu/:userName', menus.getMinors);
app.get('/colleges-menu/:userName', menus.getColleges);

app.get('/populate-toadd', add.populate);

app.post('/schedule-change', schedule.change);
app.get('/schedule-check/:userName/:scheduleName', schedule.check);
app.get('/schedule-course-info/:course', schedule.courseInfo);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
