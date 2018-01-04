/**
 * Module dependencies
 */
// configuration
var appConfig = require('./app.config');
var credentials = require('./credentials');
var resizeVersion = require('./config').resizeVersion;
var dirs = require('./config.js').dirs;

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var path = require('path');
var compression = require('compression');
var csurf = require('csurf');
var errorHandler = require('errorHandler');
var favicon = require('serve-favicon');

var fortune = require('./libs/fortune');
var cartValidation = require('./libs/cartValidation');
var mailer = require('./libs/mailer');
mailer.send({
	to: 'rogalsky.alexander@gmail.com',
	subject: 'Nodemailer is unicode friendly ✔',
	text: 'Hello to myself!',
	html: '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
	      '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>' +
	      'Embedded image: <img src="cid:unique@kreata.ee"/>',
	attachments: [],
	headers: {},
});

// var routes = require('./routes');
var tours = require('./tours');
var weather = require('./weather');

var formidable = require('formidable');
var handlebars = require('express-handlebars').create({
	layoutsDir: path.join(__dirname, appConfig.layout.layoutsDir),
  	partialsDir: path.join(__dirname, appConfig.layout.partialsDir),
  	defaultLayout: appConfig.layout.defaultLayout,
  	extname: 'handlebars',
  	helpers: {
  		section: function(name, options) {
  			this._sections = this._sections || {};
  			this._sections[name] = options.fn(this);
			return null;
  		}
  	}
});

var jqupload = require('jquery-file-upload-middleware');

var morgan = require('morgan');
var fs = require('fs');
var rfs = require('rotating-file-stream');

var logDirectory = path.join(__dirname, appConfig.log.location);
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = rfs(appConfig.log.fileName, {
	interval: appConfig.log.rotation,
	path: logDirectory
});

var responseTime = require('response-time');
// var vhost = require('vhost');

//-----------------------------------------

var app = module.exports = express();
app.engine('handlebars', handlebars.engine);

var sess =
{
	secret: credentials.session.key,
	resave: false,
	saveUninitialized: false,
	key: 'id',
	cookie: { secure: false, httpOnly: true, signed: true, maxAge: credentials.session.maxAge },
};
// //$NODE_ENV=production node server
app.use('production', function() {
	app.enable('view cache');
	app.disable('x-powered-by');
	// app.use(errorHandler());
	app.set('trust proxy', 1);
	sess.cookie.secure = true;
});
app.use('development', function() {
	app.disable('view cache');
	app.use(errorHandler({ dumpExceptions: true, showStack: true }));
});

app.use(express.static(path.join(__dirname, appConfig.default.location)));
app.use(appConfig.vendor.url, express.static(__dirname + appConfig.vendor.location));
app.use(appConfig.images.url, express.static(__dirname + appConfig.images.location));
app.use(appConfig.views.url, express.static(__dirname + appConfig.views.location));
app.use(appConfig.js.url, express.static(__dirname + appConfig.js.location, { maxAge: appConfig.js.maxAge }));
app.use(appConfig.css.url, express.static(__dirname + appConfig.css.location, { maxAge: appConfig.css.maxAge }));
app.use(appConfig.resources.url, express.static(__dirname + appConfig.resources.location, { hidden: true }));
app.use(favicon(path.join(__dirname, appConfig.icons.location, appConfig.icons.url)));

app.use(responseTime());
app.use(compression({filter: shouldCompress}));
// app.use('/upload', jqupload.fileHandler());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookie.key));
app.use(session(sess));
app.use(csurf({ cookie: false }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(methodOverride('X-HTTP-Method')); // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
app.use(methodOverride('X-Method-Override')); // IBM
app.use(morgan('combined', { stream: accessLogStream }));

app.set('vendor', path.join(__dirname, appConfig.vendor.location));
app.set('views', path.join(__dirname, appConfig.views.location));
app.set('js', path.join(__dirname + appConfig.js.location));
app.set('css', path.join(__dirname + appConfig.css.location));
app.set('images', path.join(__dirname + appConfig.images.location));
app.set('resources', path.join(__dirname + appConfig.resources.location));
app.set('view engine', 'handlebars');
app.set('view options', { layout: false });
// app.set('view cache', false);
app.set('port', process.env.PORT || 3000);

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
	res.locals.showTests = (app.get('env') !== 'production' && req.query.test === '1');
	next();
	// res.status(200);
	// res.send('User: ' + req.remoteUser.username);
});
app.use(function(req, res, next) {
	res.locals.partials = res.locals.partials || {};
	res.locals.partials.weatherContext = weather;
	next();
});
app.use(function(req, res, next) {
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

//app.use('/blog', require('./blog'));
app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuestCounts);

//--------------------------------------------

app.get('/upload*', function(req, res, next) {
	res.redirect('/');
});
app.put('/upload*', function( req, res ){
	res.redirect('/');
});
app.delete('/upload*', function( req, res ){
	res.redirect('/');
});
//http://localhost:3000/uploads/1515003855854/0ce3e242352582b6a1d3c550c40_prev.jpg
app.use('/upload', function(req, res, next) {
	var dir = JSON.stringify(Date.now());
	jqupload.fileHandler({
		tmpDir: dirs.temp,
		uploadDir: function() {
			return path.join(__dirname, dirs.base, dir);
		},
		uploadUrl: function() {
			return path.join(dirs.baseUrl, dir);
		},
		targetDir: this.uploadDir,
	    targetUrl: this.uploadUrl,
	    ssl: false,
	    hostname: null,
		imageVersions: resizeVersion.base,
        maxPostSize: 1000 * 1000 * 1000,
	    minFileSize: 1,
	    maxFileSize: 1000 * 1000 * 1000,
	    acceptFileTypes: /.+/i,
	    imageTypes: /\.(gif|jpe?g|png)$/i,
	    imageArgs: ['-auto-orient'],
	    accessControl: {
	        allowOrigin: '*',
	        allowMethods: 'POST, PUT, DELETE'
	    },
	})(req, res, next);
});

app.use('/upload/list', function(req, res, next) {
    jqupload.fileManager({
        uploadDir: function () {
            return path.join(__dirname, dirs.base);
        },
        uploadUrl: function () {
            return dirs.baseUrl;
        }
    }).getFiles(function (files) {
        res.json(files);
    });
});

// app.use('/upload/location', function(req, res, next) {
// 	jqupload.fileHandler({
// 		uploadDir: function () {
// 			return path.join(__dirname, dirs.location, req.sessionID);
//         },
//         uploadUrl: function () {
//         	return path.join(dirs.locationUrl, req.sessionID);
//         },
//         imageVersions: resizeVersion.location
// 	})(req, res, next);
// });

// app.use('/upload/location/list', function(req, res, next) {
//     jqupload.fileManager({
//         uploadDir: function () {
//             return path.join(__dirname, dirs.location);
//         },
//         uploadUrl: function () {
//             return dirs.locationUrl;
//         }
//     }).getFiles(function (files) {
//         res.json(files);
//     });
// });

// app.use('/upload/location', function(req, res, next) {
// 	jqupload.fileHandler({
// 	    tmpDir: dirs.temp,
// 	    uploadDir: function() {
// 			return path.join(__dirname, dirs.location);
// 		},
// 		uploadUrl: function() {
// 			return dirs.locationUrl;
// 		},
// 	    imageVersions: resizeVersion.location
// 	});
// });

// app.use('/upload/location/list', function(req, res, next) {
//     jqupload.fileManager({
//         uploadDir: function () {
//             return path.join(__dirname, dirs.location);
//         },
//         uploadUrl: function () {
//             return dirs.locationUrl;
//         }
//     }).getFiles(function (files) {
//         res.json(files);
//     });
// });

// Moving uploaded files to different dir:

//         app.use('/api', function (req, res, next) {
//             req.filemanager = upload.fileManager();
//             next();
//         });

//         app.use('/api/endpoint', function (req, res, next) {
//             // your real /api handler that will actually move the file
//             ...
//             // req.filemanager.move(filename, path, function (err, result))
//             req.filemanager.move('SomeFile.jpg', 'project1', function (err, result) {
//                 // SomeFile.jpg gets moved from uploadDir/SomeFile.jpg to
//                 // uploadDir/project1/SomeFile.jpg
//                 // if path is relative (no leading slash), uploadUrl will
//                 // be used to generate relevant urls,
//                 // for absolute paths urls are not generated
//                 if (!err) {
//                     // result structure
//                     // {
//                     //     filename: 'SomeFile.jpg',
//                     //     url: '/uploads/project1/SomeFile.jpg',
//                     //     thumbail_url : '/uploads/project1/thumbnail/SomeFile.jpg'
//                     // }
//                     ...
//                 } else {
//                     console.log(err);
//                 }
//             });
//         });


// Moving uploaded files out of uploadDir:


//         app.use('/api', function (req, res, next) {
//             var user = db.find(...);

//             req.filemanager = upload.fileManager({
//                 targetDir: __dirname + '/public/u/' + user._id,
//                 targetUrl: '/u/' + user._id,
//             });

//             // or
//             req.filemanager = upload.fileManager({
//                 targetDir: function () {
//                     return __dirname + '/public/u/' + user._id
//                 },
//                 targetUrl: function () {
//                     return'/u/' + user._id
//                 }
//             });
//             ...
//             req.filemanager.move(req.body.filename, 'profile', function (err, result) {
//                 // file gets moved to __dirname + '/public/u/' + user._id + '/profile'
//                 if (!err) {

//                 }
//             });
//         });


// Getting uploaded files mapped to their fs locations:


//         app.use('/list', function (req, res, next) {
//             upload.fileManager().getFiles(function (files) {
//                 //  {
//                 //      "00001.MTS": {
//                 //          "path": "/home/.../public/uploads/ekE6k4j9PyrGtcg+SA6a5za3/00001.MTS"
//                 //      },
//                 //      "DSC00030.JPG": {
//                 //          "path": "/home/.../public/uploads/ekE6k4j9PyrGtcg+SA6a5za3/DSC00030.JPG",
//                 //          "thumbnail": "/home/.../public/uploads/ekE6k4j9PyrGtcg+SA6a5za3/thumbnail/DSC00030.JPG"
//                 //      }
//                 //  }
//                 res.json(files);
//             });
//         });

//         // with dynamic upload directories

//         app.use('/list', function (req, res, next) {
//             upload.fileManager({
//                 uploadDir: function () {
//                     return __dirname + '/public/uploads/' + req.sessionID
//                 },
//                 uploadUrl: function () {
//                     return '/uploads/' + req.sessionID
//                 }
//             }).getFiles(function (files) {
//                 res.json(files);
//             });
//         });

app.listen(app.get('port'), function() {
	console.log('\033[96m + \033[39m app is listening on *:' + app.get('port'));
});

//-----------------------------------------------------

// jqupload.configure({
//     uploadDir: __dirname + '/public/uploads/',
//     uploadUrl: '/uploads'
// });
jqupload.on('end', function (fileInfo) {
    console.log("files upload complete");
    console.log(fileInfo);
});
jqupload.on('delete', function (fileName) {
    console.log("files remove complete");
    console.log(fileName);
});
jqupload.on('error', function (err) {
	console.log("files error");
    console.log(err.message);
});
jqupload.on('abort', function (fileInfo, req, res) {
	console.log("files abort");
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
	res.render('about',
	{
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
		}
		next();
	});
});

app.get('/newsletter', function(req, res, next) {
	res.render('newsletter', { csrf: req.csrfToken() });
});

app.get('/newsletter/archive', function(req, res, next) {
	res.render('newsletter', { csrf: req.csrfToken() });
});

app.post('/process', function(req, res, next) {
	if(req.xhr || req.accepts('json.html') === 'json') {
		res.send({ success: true });
	}
	console.log('Form: ' + req.query.form);
	console.log("Token: " + req.body._csrf);
	console.log("Name: " + req.body.name);
	console.log("Email: " + req.body.email);
	res.redirect(303, '/success');
});

app.get('/success', function(req, res, next) {
	res.render('success');
});

app.get('/contest/vacation-photo', function(req, res, next) {
	var now = new Date();
	res.setHeader('Cache-Control', 'no-cache');
	res.cookie('signed_upload', 'signed', { secure: false, httpOnly: true, signed: true });
	res.render('vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
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

app.get('/location/input', function (req, res) {
    var params = {
        title: "jquery file upload example"
    };
    res.render('form', params);
});

app.post('/location/input', function (req, res) {
    console.log('\n===============================================\n');
    console.log(req.body);
    res.send(req.body);
});

app.post('/newsletter', function(req, res) {
	var name = req.body.name || '';
	var email = req.body.email || '';
	if(!validateEmail(email)) {
		if(req.xhr) {
			return res.json({ error: 'Invalid email address' });
		}
		res.locals.flash =
		{//req.session.flash
			type: 'danger',
			title: 'Validation error',
			message: 'Invalid email address',
		};
		return res.redirect(303, '/newsletter/archive');
	}
	//new NewsLetterSignup({name: data.name, email: data.email}).save(function(err) {
		var err = 0;
		if(err) {
			if(req.xhr) return res.json({ error: "DB error" });
			res.locals.flash =
			{//req.session.flash
				type: 'danger',
				title: 'DB ERROR',
				message: 'Database is not available',
			}
			return res.redirect(303, '/newsletter/archive');
		}
		if(req.xhr) return res.json({ success: true });
		res.locals.flash =
		{//req.session.flash
			type: 'success',
			title: 'Confirmation',
			message: 'You have been successfully subscribed for the newsLetter',
		}
		//return res.redirect(303, '/newsletter/archive');
		res.render('newsletter', { csrf: req.csrfToken() });
	//});
	//saveNewsLetterSubscription({ name: name, email: email });
});

//-----------------------------------------------------

app.use(function(req, res) {
	res.status(404).render('404', { status: 404, fortune: fortune.getFortune() });
});
app.use(function(err, req, res, next) {
	console.log(err);
	if (err.code !== 'EBADCSRFTOKEN') return next(err);
	res.status(500).render('500', { status: 500 });
});

//-----------------------------------------------------

function secure(req, res, next) {
	if(!req.session.logged_in) {
		return res.send(403);
		//return next('route');
	}
	next();
};
function validateEmail(email) {
	var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	return re.test(email.toLowerCase());
};
function shouldCompress(req, res) {
	if (req.headers['x-no-compression']) {
		return false
	}
	return compression.filter(req, res)
};
// create api router 
// var api = createApiRouter();
// // mount api before csrf is appended to the app stack 
// app.use('/api', api);
function createApiRouter() {
	var router = new express.Router();
	router.post('/getProfile', function(req, res) {
		res.send('no csrf to get here');
	});
	return router;
};
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

//-----------------------------------------------

// // create application/json parser
// var jsonParser = bodyParser.json();
// // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
// // POST /login gets urlencoded bodies
// app.post('/login', urlencodedParser, function (req, res) {
//   if (!req.body) return res.sendStatus(400);
//   res.send('welcome, ' + req.body.username);
// });
// // POST /api/users gets JSON bodies
// app.post('/api/users', jsonParser, function (req, res) {
//   if (!req.body) return res.sendStatus(400);
//   // create user in req.body
// });

//--------------------------------------------------
