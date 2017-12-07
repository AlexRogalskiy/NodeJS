var net = require('net');
var server = net.createServer(function(connection) {
	connection.on('error', function(err) {
		console.log(err);
		//connection.exit(1);
	});
}).listen(400, "127.0.0.1");
console.log('Server running at http://127.0.0.1:400/'.rainbow);