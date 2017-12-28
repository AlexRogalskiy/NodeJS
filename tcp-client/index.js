var net = require('net');

var client = net.connect(445, 'localhost');
client.setEncoding('utf8');
client.on('connect', function() {
	console.log('\033[90m client connection established\033[39m');
	client.write('HELLO');
});
client.on('data', function(data) {
	console.log(data);
});
client.on('close', function() {
	console.log('close');
});
client.on('end', function() {
	console.log('End');
});
client.on('error', function() {
	console.log('Error');
});