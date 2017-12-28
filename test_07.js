var http = require('http');

var server = http.createServer(function(rq, res) {
	res.writeHead(200, { 'Content-type' : 'image/png' });
	var stream = require('fs').createReadStream('image.png');
	stream.pipe(res);
	// stream.on('data', function(data) {
	// 	res.write(data);
	// });
	// stream.on('end', function() {
	// 	res.end();
	// });
	// res.end('Hello, <b>World</b>');
});
server.listen(3000, function() {
	console.log('\033[96m server listening on *: 3000\033[39m');
});
