/**
 * Module dependencies
 */
var connect = require('connect');
// var time = require('./request-time');
var mime = require('mime-types');
var users = require('./users');
// var redis = require('connect-redis')(connect);

var server = connect.createServer();
server.use(connect.methodOverride());

//POST /url?_method=PUT HTTP/1.1
// var server = connect(connect.bodyParser(), connect.static('static'));
// server.use(connect.logger('dev'));//default / dev / short / tiny
// server.use(time({time: 500}));

// server.use(connect.session({ store: new redis, secret : 'secret' }));

server.use(function(req, res, next) {
	if('/a' == req.url) {
		res.writeHead(200);
		res.end("Fast!");
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	if('/b' == req.url) {
		setTimeout(function() {
			res.writeHead(200);
			res.end('Slow!');
		}, 1000);
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	if('/' == req.url && 'POST' == req.method && req.body.file) {
		fs.readFile(req.body.file.path, 'utf8', function(err, data) {
			if(err) {
				res.writeHead(500);
				res.end('Error');
				return;
			}
			res.writeHead(200, { 'Content-Type' : 'text/html' });
			res.end([
				'<h3>File: ' + req.body.file.name + '</h3>',
				'<h4>Type: ' + req.body.file.type + '</h4>',
				'<h4>Contents:</h4><pre>' + data + '</pre>'
			].join(''));
		});
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	if('/' == req.url && req.session && req.session.logged_in) {
		res.writeHead(200, { 'Content-Type' : 'text/html' });
		res.end("Session: " + req.session.name + '<a href="/logout">Logout</a>');
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	if('/upload' == req.url && 'GET' == req.method) {
		res.writeHead(200, { 'Content-Type' : 'text/html' });
		res.end([
			'<form action="/" method="POST" enctype="multipart/form-data">',
			'<fieldset>',
			'<legend>Post in file</legend>',
			'<p>Upload file: <input type="file" name="file" /></p>',
			'<input type="submit" />',
			'</fieldset>',
			'</form>'
		].join(''));
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	if('/login' == req.url && 'POST' == req.method) {
		res.writeHead(200);
		if(!users[req.body.user] || req.body.password != users[req.body.user].password) {
			res.end('Bad username / password');
		} else {
			req.session.logged_in = true;
			req.session.name = users[req.body.user].name;
			res.end('Authenticated');
		}
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	if('/' == req.url && 'GET' == req.method) {
		res.writeHead(200, { 'Content-Type' : 'text/html' });
		res.end([
			'<form action="/login" method="POST">',
			'<fieldset>',
			'<legend>Log in</legend>',
			'<p>User: <input type="text" name="user" /></p>',
			'<p>Password: <input type="text" name="password" /></p>',
			'<input type="submit" />',
			'</fieldset>',
			'</form>'
		].join(''));
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	if('/logout' == req.url) {
		req.session.logged_in = false;
		req.writeHead(200);
		res.end('Logged out!');
	} else {
		next();
	}
});

server.use(function(req, res, next) {
	res.writeHead(200);
	res.end('User: ' + req.remoteUser.username);
});

server.use(connect.static('static'));
server.use('/images', connect.static(__dirname + '/images'));
server.use('/templates', connect.static(__dirname + '/templates'));
server.use('/js', connect.static(__dirname + '/bundles', { maxAge: 10000000000000 }));
server.use('/resources', connect.static(__dirname + '/resources', { hidden: true }));

// server.use(connect.query);
// server.use(function(req, res) {
// 	//req.query.page == '5'
// });

// server.use(connect.logger(':method :remote-addr'));
// server.use(connect.logger('type is :res[content-type], length is' + 
							// ':res[content-length] and it took :response-time ms.'));

//:req[accept]
//:res[content-length]
//:http-version
//:response-time
//:remote-addr
//:date
//:method
//:url
//:referrer
//:user-agent
//:status

// connect.logger.token('type', function(req, res) {
// 	return req.headers['content-length'];
// });

server.use(connect.bodyParser());
server.use(connect.cookieParser());
// server.use(connect.session({ s: '' }));
// server.use(function(req, res, next) {
// 	req.body.myinput
//	req.cookies.secret1 = "value";
// });

process.stdin.resume();
process.stdin.setEncoding('ascii');

connect.basicAuth(function(user, pass, fn) {
	process.stdout.write('Allow user \033[96m' + user + '\033[39m' + ' with pass \033[90m' + pass + '\033[39m ? [y/n]: ');
	process.stdin.once('data', function(data) {
		if(data[0] == 'y') {
			fn(null, { username: user });
		} else {
			fn(new Error('Unauthorized'));
		}
	});
});

server.listen(3000);