/**
 * Module dependencies
 */
var wsio = require('websocket.io');
var mime = require('mime-types');
var express = require('express');

var app = express();//express.createServer();
app.set('views', __dirname + '/public');
app.set('view options', { layout: false });
app.set('view cache', true);

var ws = wsio.attach(app);

app.use('/static', express.static(__dirname + '/public'));

var positions = {}, total = 0;

ws.on('connection', function(socket) {
	socket.on('message', function(message) {
		console.log(message);
		//socket.send('response');
		try {
			var pos = JSON.parse(message);
		} catch(e) {
			return;
		}
		positions[socket.id] = pos;
		broadcast(JSON.stringify({ type: 'position', pos: pos, id: socket.id }));
	});
	socket.on('close', function() {
		delete positions[socket.id];
		broadcast(JSON.stringify({ type: 'disconnect', id: socket.id }));
	});
	socket.id = ++total;
	socket.send(JSON.stringify(positions));
});

function broadcast(message) {
	for(var i=0, l = ws.clients.length; i<l; i++) {
		if(ws.clients[i] && socket.id != ws.clients[i].id) {
			ws.clients[i].send(message);
		}
	}
};

app.listen(3000);
