var net = require('net');

var count = 0;

var server = net.createServer(function(connection) {
	console.log('\033[90m new connection established\033[39m');
	connection.write('\n > welcome to \033[93mnode-chat\033[39m' +
			   '\n > ' + ++count + ' total peers connected' +
			   '\n > please writer your name and press enter: '
	);
	connection.on('end', function() {
		console.log('End');
	});
	connection.on('error', function() {
		console.log('Error');
	})
	connection.on('close', function() {
		console.log('Disconnected');
		count--;
	})
});

server.listen(3000, function() {
	console.log('\033[96m server listening on *: 3000\033[39m');
});