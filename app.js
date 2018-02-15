
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
        populateTerm: function(termId, courses) {
            var termLabel = {
                'f': "fall",
				'w': "winter",
				's': "spring",
				's1': "summer I",
                's2': "summer II"
            }[termId];

            ret = "<div class=\"term-label\">" + termLabel + "</div>\n"
                + "<div class=\"term " + termLabel.replace(/\s/g, '-') + "\">\n"
            for (let course of courses) {
                ret += templates.courseCard(course);
            }
            ret += "</div>"

            return ret;
        },
        populateToAdd: function(user, majors, minors, colleges, courses) {

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
var add = require('./routes/add');

app.get('/', index.view);
app.get('/plan-minor', plan.minor);
app.get('/plan-major', plan.major);
app.get('/plan-college', plan.college);
app.get('/plan-course', plan.course);
app.get('/add', add.course);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
