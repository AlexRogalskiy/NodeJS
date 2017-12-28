/**
 * Module dependencies
 */
var sio = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();//express.createServer();
app.use('/static', express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });
app.set('view cache', true);
// app.use(methodOverride());

var io = sio.listen(app);
io.sockets.on('connection', function(socket) {
	socket.send('a');
	socket.on('message', function(msg) {
		console.log(msg);
	});
	socket.on('join', function(name) {
		socket.nickname = name;
		socket.broadcast.emit('announcement', name + ' joined the chat.');
	});
	socket.on('text', function(msg) {
		socket.broadcast.emit('text', socket.nickname, msg);
	});
	socket.on('disconnect', function() {
		io.sockets.emit('announcement', 'announcement');
		//socket.emit('emit');
	});
	//socket.emit('event', { obj : 'object' });
});

app.listen(3000);
//io.sockets.on('connection');
//io.of('/ns').on('connection');
// sio.sockets.on('connection', function(socket) {
// 	socket.send('a');
// 	socket.on('message', function(msg) {
// 		console.log(msg);
// 	});
// 	socket.emit('event', { obj : 'object' });
// });

// var socket = io.connect();//io.connect('/ns');
// socket.on('event', function(obj) {
// 	console.log(obj);
// });
