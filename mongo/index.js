/**
 * Module dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var mongodb = require('mongodb');
// var Db = require('mongodb').Db;
// var Server = require('mongodb').Server;

var app = express();//express.createServer();
app.use('/static', express.static(__dirname + '\\views'));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });
app.set('view cache', true);
app.set(methodOverride());
// app.use(session());
app.use(session({secret:'learningpassport', resave: true, saveUninitialized: true}));


app.get('/', function(req, res, next) {
	res.render('index');//{ authenticated : false }
});
app.get('/login/:signupEmail?', function(req, res, next) {
	res.render('login', { signupEmail: req.params.signupEmail });
});
app.post('/signup', function(req, res, next) {
	app.users.insert(req.body.user, function(err, doc) {
		if(err) return next(err);
		res.redirect('/login/' + doc.ops[0].email);
	});
});
app.get('/signup', function(req, res, next) {
	res.render('signup');
});
app.post('/login', function(req, res, next) {
	app.users.findOne({ email: req.body.user.email, password: req.body.user.password }, function(err, doc) {
		if(err) return next(err);
		if(!doc) return res.send('<p>User is not found</p>');
		req.session.loggedIn = doc._id.toString();
		res.redirect('/');
	});
});
app.get('/logout', function(req, res) {
	req.session.loggedIn = null;
	res.redirect('/');
});
app.use(function(req, res, next) {
	if(req.session.loggedIn) {
		res.local('authenticated', true);
		app.users.findOne({ _id: { $oid: req.session.loggedIn } }, function(err, doc) {
			if(err) return next(err);
			res.local('me', doc);
			next();
		});
	} else {
		res.local('authenticated', false);
		next();
	}
});
//app.users.insert({}, {options});
//app.users.update({ _id: id }, { $set: { title: '' }, tags: { $push: "tag" }})
//db.getLastError


var server = new mongodb.Server('127.0.0.1', 27017);
var db = new mongodb.Db('site', server);
db.open(function(err, db) {
	if(err) throw err;
	console.log('\033[96m + \033[39m connected to mondodb');
	//app.users = new mongodb.Collection(db, 'users');
	app.users = db.collection('users');
	db.ensureIndex('users', 'email', function(err) {
		if(err) throw err;
		db.ensureIndex('users', 'password', function(err) {
			if(err) throw err;
			console.log('\033[96m + \033[39m ensured indexes');
		})
	})
});

app.listen(3000, function() {
	console.log('\033[96m + \033[39m app is listening on *:3000');
});
