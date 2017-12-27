var http = require('http');

var server = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.end('Hello <b>World</b>');
});

module.exports = server;

//npm install -g up
//up -watch -port 80 server.js