/**
 * Module dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var Sequelize = require('sequelize');

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
	Project.findAll()
	.then(function(projects) {
		res.render('index', { projects: projects });
	})
	.catch((err) => {
		console.log(err);
		next();
	});
});
app.delete('/project/:id', function(req, res, next) {
	Project.find(Number(req.params.id))
	.then(function(project) {
		project.destroy()
		.success(function() {
			res.send(200);
		})
		.error(next);
	})
	.catch((err) => {
		console.log(err);
		next();
	});
});
app.post('/projects', function(req, res, next) {
	Project.build(req.body).save()
	.then(function(obj) {
		res.send(obj);
	})
	.catch((err) => {
		console.log(err);
		next();
	});
});
app.get('/project/:id/tasks', function(req, res, next) {
	Project.findById(Number(req.params.id))
	.then(function(project) {
		project.getTasks().then(function(items) {
			res.render('tasks', { project: project, tasks: items });
		})
		.catch((err) => {
			console.log(err);
			next();
		});
	})
	.catch((err) => {
		console.log(err);
		next();
	});
});
app.post('/project/:id/tasks', function(req, res, next) {
	req.body.ProjectId = req.params.id;
	Task.build(req.body).save()
	.then(function(obj) {
		res.send(obj);
	})
	.catch((err) => {
		console.log(err);
		next();
	});
});
app.delete('/task/:id', function(req, res, next) {
	Task.find(Number(req.params.id))
	.then(function(task) {
		task.destroy()
		.success(function() {
			res.send(200);
		})
		.error(next);
	})
	.catch((err) => {
		console.log(err);
		next();
	});
});
//task.updateAttributes({
// 	title: ''
// });

app.listen(3000, function() {
	console.log('\033[96m + \033[39m app is listening on *:3000');
});

//----------------------------------------------------

var sequelize = new Sequelize({database: 'todo', host: "localhost", username: 'root', password: 'toor', dialect: 'mysql'});
var Project = sequelize.define('Project', {
	title: { type: Sequelize.STRING, defaultValue: 'no title' },
	description: Sequelize.TEXT,
	created: { type: Sequelize.DATE, defaultValue: new Date()}
});
var Task = sequelize.define('Task',
	{
		id: {
	        type: Sequelize.INTEGER,
	        primaryKey: true,
	        autoIncrement: true
	    },
		title: {
			type: Sequelize.STRING,
			isUppercase: false,
			defaultValue: 'no task'
		},
		content: Sequelize.TEXT,
		name: Sequelize.STRING,
		type: {
            type: Sequelize.ENUM,
            values: ['public_services', 'local_services'],
            defaultValue: 'public_services'
        }
	},
	{
		classMethods: {
			staticMethod: function() {}
		}
	},
	{
		instanceMethods: {
			instanceMethod: function() {}
		}
	}
);
//Task.staticMethod()
// Task.find(4).then(function(task) {
// 	task.instanceMethod();
// })
// .catch((err) => {
// 	console.log(err);
// 	next();
// });

Task.belongsTo(Project);
Project.hasMany(Task);
sequelize.sync({ force: true });

Project.findAll().then(function(projects) {
	console.log(projects)
}).catch((err) => {
	console.log(err);
});