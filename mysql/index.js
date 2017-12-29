/**
 * Module dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var mysql = require('mysql');
var config = require('./config');

var app = express();//express.createServer();
app.use('/static', express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });
app.set('view cache', true);
app.set(methodOverride());
app.use(session({secret:'learningpassport', resave: true, saveUninitialized: true}));

app.get('/', function(req, res, next) {
	db.query('select id, title, description from item', function(err, results) {
		res.render('index', { items: results || [] });
	});
});
app.post('/create', function(req, res, next) {
	db.query('insert into item(title, description) values(?, ?)',
		[req.body.title, req.body.description], function(err, info) {
			if(err) return next(err);
			console.log(' - item created with id %s', info.insertId);
			res.redirect('/');
		});
});
app.get('/item/:id', function(req, res, next) {
	function getItem(fn) {
		db.query('select id, title, description from item where id=? limit 1',
			[req.params.id], function(err, results) {
				if(err) return next(err);
				if(!results[0]) return res.send(404);
				fn(results[0]);
			});
	};
	function getReviews(item_id, fn) {
		db.query('select text, stars from review where item_id=?',
			[item_id], function(err, results) {
				if(err) return next(err);
				fn(results);
			});
	};
	getItem(function(item) {
		getReviews(item.id, function(reviews) {
			res.render('item', { item: item, reviews: reviews });
		});
	});
});
app.post('/item/:id/review', function(req, res, next) {
db.query('insert into review set item_id=?, stars=?, text=?',
	[req.params.id, req.body.stars, req.body.text], function(err, info) {
		if(err) return next(err);
		console.log(' - review created with id %s', info.insertId);
		res.redirect('/item/' + req.params.id);
	});
});

app.listen(3000, function() {
	console.log('\033[96m + \033[39m app is listening on *:3000');
});

//-----------------------------

// var db = mysql.createConnection(config);
var db  = mysql.createPool(config);
db.on('error', function(err) {
	console.log(err);
	if(err.code === 'ETIMEDOUT' ){
         db.connect();
    }
});
// db.end(function(err) {
// 	console.log(err);
// });
db.query({ sql: 'SELECT 1 + 1 AS solution', timeout: 40000 }, function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
db.on('acquire', function (connection) {
	console.log('Connection %d acquired', connection.threadId);
});
db.on('connection', function (connection) {
	connection.query('SET SESSION auto_increment_increment=1');
});
db.on('enqueue', function () {
	console.log('Waiting for available connection slot');
});
db.on('release', function (connection) {
	console.log('Connection %d released', connection.threadId);
});
db.getConnection(function(err, connection) {
  connection.query('SELECT * FROM item', function (error, results, fields) {
  	console.log(results);
    connection.release();
    if (error) throw error;
  });
});
//----------------------------------------------------
//https://github.com/mysqljs/mysql#pooling-connections

// var post  = {id: 1, title: 'Hello MySQL'};
// var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
//   if (error) throw error;
//   // Neat!
// });
// console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

// var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
// var sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
// console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42

// var query = "SELECT * FROM posts WHERE title=" + mysql.escape("Hello MySQL");
// console.log(query); // SELECT * FROM posts WHERE title='Hello MySQL'

// var sorter = 'date';
// var sql    = 'SELECT * FROM posts ORDER BY ' + connection.escapeId(sorter);
// connection.query(sql, function (error, results, fields) {
//   if (error) throw error;
//   // ...
// });

// var sorter = 'date';
// var sql    = 'SELECT * FROM posts ORDER BY ' + connection.escapeId('posts.' + sorter);
// // -> SELECT * FROM posts ORDER BY `posts`.`date`

// var sorter = 'date.2';
// var sql    = 'SELECT * FROM posts ORDER BY ' + connection.escapeId(sorter, true);
// // -> SELECT * FROM posts ORDER BY `date.2`

// var userId = 1;
// var columns = ['username', 'email'];
// var query = connection.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userId], function (error, results, fields) {
//   if (error) throw error;
//   // ...
// });
// console.log(query.sql); // SELECT `username`, `email` FROM `users` WHERE id = 1