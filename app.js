
/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');
var express = require('express');
var expresshbs = require('express3-handlebars')

var app = express();

var handlebars = expresshbs.create({
    helpers: {
        populateTerm: function(termKey, courses) {
            var termLabel = {
                'f': "fall",
				'w': "winter",
				's': "spring",
				's1': "summer1",
                's2': "summer2"
            }[termKey]
            ret = "<div class=\"term-label\">" + termLabel + "</div>\n"
                + "<div class=\"term " + termLabel + "\" id=\"{{@index}}-" + termLabel + "\">\n"
            var coursesCount = 6;
            for (let course of courses) {
                ret += "<div class=\"slot\">" + course + "</div>\n";
                coursesCount--;
            }
            for (; coursesCount > 0; coursesCount--) {
                ret += "<div class=\"slot\"></div>\n";
            }
            ret += "</div>"
            return ret;
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
// Example route
// var user = require('./routes/user');

app.get('/', index.view);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
