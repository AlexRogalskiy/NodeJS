/**
 * Module dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var path = require('path');
var fortune = require('./libs/fortune');
// var routes = require('./routes');
var tours = require('./tours');
var weather = require('./weather');

var formidable = require('formidable');

var handlebars = require('express-handlebars').create({
	layoutsDir: path.join(__dirname, 'public/views/layouts'),
  	partialsDir: path.join(__dirname, 'public/views/partials'),
  	defaultLayout: 'main',
  	extname: 'handlebars',
  	helpers: {
  		section: function(name, options) {
  			this._sections = this._sections || {};
  			this._sections[name] = options.fn(this);
			return null;
  		}
  	}
});

var app = module.exports = express();
app.engine('handlebars', handlebars.engine);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(__dirname + '/public/vendor'));
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

app.set('vendor', path.join(__dirname, '/public/vendor'));
app.set('views', path.join(__dirname, '/public/views'));
app.set('js', path.join(__dirname + '/public/js'));
app.set('css', path.join(__dirname + '/public/css'));
app.set('images', path.join(__dirname + '/public/images'));
app.set('resources', path.join(__dirname + '/public/resources'));
app.set('view engine', 'handlebars');
app.set('view options', { layout: false });
app.set('view cache', false);
app.set('port', process.env.PORT || 3000);
app.set(methodOverride());

// //$NODE_ENV=production node server
app.use('production', function() {
	app.enable('view cache');
	app.disable('x-powered-by');
});
app.use('development', function() {
	app.disable('view cache');
});
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

app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
	// res.status(200);
	// res.send('User: ' + req.remoteUser.username);
});

app.use(function(req, res, next) {
	res.locals.partials = res.locals.partials || {};
	res.locals.partials.weatherContext = weather;
	next();
});

app.listen(app.get('port'), function() {
	console.log('\033[96m + \033[39m app is listening on *:' + app.get('port'));
});

//-----------------------------------------------------

app.get('/', function(req, res, next) {
	res.render('home');//{ authenticated : false }
});

app.get('/headers', function(req, res, next) {
	res.set('Content-Type', 'text/plain');
	var s = '';
	for(var name in req.headers) {
		s += name + ' : ' + req.headers[name] + '\n';
	}
	res.send(s);
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
	res.render('about', { pageTestScript: '/tests/page-about.js' });
});

app.get('/tours/prime', function(req, res) {
	res.render('tours/prime-tour');
});

app.get('/tours/fast', function(req, res) {
	res.render('tours/prime-tour');
});

app.get('/tours/price-group-rate', function(req, res) {
	res.render('tours/price-group-rate');
});

app.get('/greeting', function(req, res) {
	res.render('about', {
		message: 'welcome',
		style: req.query.style,
		userid: req.cookie.userid,
		username: req.session.username,
	});
});

app.get('/no-layout', function(req, res) {
	res.render('no-layout', { layout: null });
});

app.get('/custom-layout', function(req, res) {
	res.render('custom-layout', { layout: 'custom' });
});

app.get('/test', function(req, res) {
	res.type('text/plain');
	res.send('');
});

app.put('/api/tour/:id', function(req, res) {
	var tour = tours.tours.filter(function(tour) {
		return tour.id === req.params.id;
	})[0];
	if(tour) {
		tour.name = req.query.name || '';
		tour.price = req.query.price || '';
		res.json({ success: true });
	}
	res.json({ 'error': 'Tour not found' });
});

app.put('/api/tour/:id', function(req, res) {
	var i = -1;
	for(i=tours.tours.length-1; i>=0; i--) {
		if(tours.tours[i].id === req.params.id) break;
	}
	if(i >= 0) {
		tours.tours.splice(i, 1);
		res.json({ success: true });
	}
	res.json({ error: 'Tour not found' });
});

app.get('/api/tours', function(req, res) {
	res.json(tours.tours);
});

app.get('/api/tours/format', function(req, res) {
	var toursXml = '<?xml version="1.0"?><tours>' +
		tours.tours.map(function(tour) {
			return '<tour price="' + tour.price + '" id="' + tour.id + '">' + tour.name + '</tour>';
		}).join('') + '</tours>';
	res.format({
		'application/json': function() {
			res.json(tours);
		},
		'application/xml': function() {
			res.type('application/xml');
			res.send(toursXml);
		},
		'text/xml': function() {
			res.type('text/xml');
			res.send(toursXml);
		},
		'text/plain': function() {
			res.type('text/plain');
			res.send(toursXml);
		}
	});
});

app.get('/process-contact', function(req, res) {
	console.log('Details: name=' + req.body.name + ', email=' + req.body.email);
	try {
		//saving data to db
		return res.xhr ? res.render({success: true}) : res.redirect(303, '/acknowledge');
	} catch(ex) {
		return res.xhr ? res.json({error: 'DB error'}) : res.redirect(303, '/db-error');
	}
});

app.get('/jquery-test', function(req, res) {
	res.render('jquery-test')
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

app.get('/newsletter', function(req, res, next) {
	res.render('newsletter', { csrf: 'token' });
});

app.get('/success', function(req, res, next) {
	res.render('success');
});

app.get('/contest/vacation-photo', function(req, res, next) {
	var now = new Date();
	res.render('vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
});

app.post('/process', function(req, res, next) {
	if(req.xhr || req.accepts('json.html') === 'json') {
		res.send({ success: true });
	} else {
		console.log('Form: ' + req.query.form);
		console.log("Token: " + req.body._csrf);
		console.log("Name: " + req.body.name);
		console.log("Email: " + req.body.email);
		res.redirect(303, '/accepted');
	}
});

app.post('/contest/vacation-photo/:year/:month', function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		if(err) return res.redirect(303, '/error');
		console.log(fields);
		console.log(files);
		res.redirect(303, '/success');
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
	res.status(404).render('404', { status: 404, fortune: fortune.getFortune() });
});
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).render('500', { status: 500 });
});

//-----------------------------------------------------

function secure(req, res, next) {
	if(!req.session.logged_in) {
		return res.send(403);
		//return next('route');
	}
	next();
}
//var fs = require('fs');
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

//req.acceptedLanguages
//req.url / req.originalUrl

//res.format({ 'text/plain': '', 'text/html': '<b></b>' });
//res.sendFile(path, options, callback);
//res.render(view, locals, callback);