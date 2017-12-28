/**
 * Module dependencies
 */
var express = require('express');
// var time = require('./request-time');
var mime = require('mime-types');
var search = require('./search');

var app = express.createServer();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });
app.set('view cache', true);

app.use('/blog', require('./blog'));
//case sensitive routes
//string routing
//jsonp callback -> app.enable('jsonp callback') => res.send / res.json
//app.register('.html', require('jade')); //haml / jade / coffeekup / jquery templates

//$NODE_ENV=production node server
app.configure('production', function() {
	app.enable('view cache');
});
app.configure('development', function() {
	//
});
app.error(function(err, req, res, next) {
	if('Bad response' == err.message) {
		res.render('error');
	} else {
		next();
	}
});
app.error(function(err, req, res, next) {
	res.render('error', { status: 500 });
});

console.log(app.set('views'));

app.get('/', function(req, res, next) {
	res.render('index');
});
app.put('/post/:name', function(req, res, next) {});
app.post('/signup', function(req, res, next) {});
app.del('/user/:id', function(req, res, next) {});
app.patch('/user/:id', function(req, res, next) {});
// app.head('/user/:id', function(req, res, next) {});

app.get('/search', function(req, res, next) {
	search(req.query.q, function(err, tweets) {
		if(err) return next(err);
		res.render('search', { results: tweets, search: req.query.q });
	});
});

app.get('/post/:name', function() {
	req.params.name == 'hello-world'
	if('h' != req.params.name[0]) {
		return next();
	}
});
app.get('/post/:name?', function(req, res, next) {
	//
});
app.get(/^\/post\/([a-z\d\-]*)/, function(req, res, next) {
	//
})
app.get('/:username', function(req, res, next) {
	getUser(req.params.username, function(err, user) {
		if(err) return next(err);
		if(exists) {
			res.render('profile');
		} else {
			next();
		}
	});
});

// app.use(express.static(__dirname + '/images'));
// app.use(express.cookieParser());
// app.use(express.session());

function secure(req, res, next) {
	if(!req.session.logged_in) {
		return res.send(403);
		//return next('route');
	}
	next();
}

app.get('roadmap', secure, function() {
	//
});

app.listen(3000);

//req.header('host');
//req.accepts('html');
//req.is('json');

//res.header('content-type');
//res.header('content-type', 'application/json');
// res.render('template', function(err, html) {
// 	//
// });
// res.send(500);
// res.send('<p>html</p>');
// res.send({ hello: 'world' });
// res.send([1, 2, 3]);
// res.json(5);
// res.redirect('/url');
// =
// res.header('Location', '/url');
// res.send(302);
// =
// res.writeHead(302, { 'Location': 'url' });
// res.redirect('/url', 301);
// res.sendfile('image.jpg');