/**
 * Module dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var mongoose = require('mongoose');
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

mongoose.connect('mongodb://localhost/site');

//-----------------------------------------------

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Author = new Schema({
	email: String,
	date: Date
});

var Comments = new Schema({
	title: String,
	body: String,
	date: Date
});

var PostSchema = new Schema({
	author: { type: ObjectId, ref: 'Author' },
	title: { type: String, index: true, default: 'Untitled' },
	content: String,
	date: Date,
	buf: Buffer,
	uid: { type: Number, unique: false, default: +new Date() },
	comments: [Comments],
	meta: {
		votes: Number,
		favs: Number
	}
});
// PostSchema.index({key: -1, otherKey: 1});
PostSchema.pre('remove', function(next) {
	emailAuthor(this.email, 'Blog post removed');
	next();
});
// PostSchema.pre('save', function(next) {
// 	if(this.isNew) {
		// this.dirtyPaths;
// 		//
// 	} else {
// 		//
// 	}
// });

var Post = mongoose.model('BlogPost', PostSchema);
//var Post = mongoose.model('BlogPost');
new Post({title: 'Title'}).save(function(err) {
	console.log('saved');
});
//db.blogposts.find({ 'meta.votes': 5 });
Post.find({author: 'asdfasdfafsd'})
	.where('title', '')
	.sort({'content': -1})
	.limit(5);
	// .run(function(err, post) {
	// 	//
	// });
// Post.find()
// 	.select({'body', 'uid'});
Post.count(function(err, totalPosts) {
	var numPages = Math.ceil(totalPosts / 10);
});
Post.find({title: ''})
	.populate('author');
	// .run(function(err, doc) {
	// 	console.log(doc.author.email);
	// });
//-----------------------------------------------

var User = mongoose.model('User', new Schema({

}));

app.listen(3000, function() {
	console.log('\033[96m + \033[39m app is listening on *:3000');
});
