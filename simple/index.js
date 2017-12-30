/**
 * Module dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var path = require('path');
var fortune = require('./lib/fortune');

var handlebars = require('express-handlebars').create({
	layoutsDir: path.join(__dirname, 'public/views/layouts'),
  	partialsDir: path.join(__dirname, 'public/views/partials'),
  	defaultLayout: 'main',
  	extname: 'handlebars'
});

var fs = require('fs');

var app = module.exports = express();
app.engine('handlebars', handlebars.engine);

app.use(express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/views', express.static(__dirname + '/public/views'));
app.use('/js', express.static(__dirname + '/public/js', { maxAge: 10000000000000 }));
app.use('/css', express.static(__dirname + '/public/css', { maxAge: 10000000000000 }));
app.use('/resources', express.static(__dirname + '/public/resources', { hidden: true }));
//app.use('/blog', require('./blog'));

app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret:'passport', resave: true, saveUninitialized: true }));

app.set('views', path.join(__dirname, '/public/views'));
app.set('js', path.join(__dirname + '/public/js'));
app.set('css', path.join(__dirname + '/public/css'));
app.set('images', path.join(__dirname + '/public/images'));
app.set('resources', path.join(__dirname + '/public/resources'));
app.set('view engine', 'handlebars');
app.set('view options', { layout: false });
app.set('view cache', true);
app.set('port', process.env.PORT || 3000);
app.set(methodOverride());

// //$NODE_ENV=production node server
// app.configure('production', function() {
// 	app.enable('view cache');
// });
// app.configure('development', function() {
// 	//
// });
// app.error(function(err, req, res, next) {
// 	if('Bad response' == err.message) {
// 		res.render('error');
// 	} else {
// 		next();
// 	}
// });
// app.error(function(err, req, res, next) {
// 	res.render('error', { status: 500 });
// });

app.listen(app.get('port'), function() {
	console.log('\033[96m + \033[39m app is listening on *:' + app.get('port'));
});

//-----------------------------------------------------

app.get('/', function(req, res, next) {
	res.render('home');//{ authenticated : false }
});

app.get('/categories', function(req, res, next) {
	res.type('text/html');
	res.send('categories');
});

app.get('/search', function(req, res, next) {
	res.type('text/html');
	res.send('search');
});

app.get('/about', function(req, res, next) {
	res.render('about');
});

app.get('roadmap', secure, function() {
	//
});

app.get('/profile/:username', function(req, res, next) {
	getUser(req.params.username, function(err, user) {
		if(err) return next(err);
		if(exists) {
			res.render('profile');
		} else {
			next();
		}
	});
});

app.get('/search', function(req, res, next) {
	search(req.query.q, function(err, tweets) {
		if(err) return next(err);
		res.render('search', { results: tweets, search: req.query.q });
	});
});

//-----------------------------------------------------

app.use(function(req, res) {
	res.status(404);
	res.render('404', { status: 404, fortune: fortune.getFortune() });
});
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500);
	res.render('500', { status: 500 });
});
app.use(function(req, res, next) {
	res.status(200);
	res.send('User: ' + req.remoteUser.username);
});

//-----------------------------------------------------

function secure(req, res, next) {
	if(!req.session.logged_in) {
		return res.send(403);
		//return next('route');
	}
	next();
};
//serverStatic(res, '/public/about.html', 'text/html')
//serverStatic(res, '/public/img/logo.jpg', 'image/jpeg')
//var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
// function serveStatic(res, path, contentType, responseCode) {
// 	responseCode = responseCode || 200;
// 	fs.readFile(__dirname + JSON.stringify(path), function(err, data) {
// 		if(err) {
// 			res.status(500);
// 			res.render('500');
// 		} else {
// 			res.status(responseCode);
// 			res.type(contentType);
// 			res.send(data);
// 		}
// 	});
// };