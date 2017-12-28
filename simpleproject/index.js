var http = require('http')
var server = http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("Connected\n");
}).listen(80, "127.0.0.1");
console.log('Server running at http://127.0.0.1:80/');