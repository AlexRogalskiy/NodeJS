var http = require('http')
var server = http.createServer(function(req, res) {
	var buf = '';
	req.on('data', function(data) {
		buf += data;
	});
	req.on('end', function() {
		console.log('All the data is ready');
	});
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("Connected\n");
}).listen(80, "127.0.0.1");
console.log('Server running at http://127.0.0.1:80/');

Date.prototype.__defineGetter__('ago', function() {
	var diff = (((new Date()).getTime() - this.getTime()) / 1000)
	var day_diff = Math.floor(diff / 86400);
	return 	day_diff == 0 &&
			diff < 60 && 'just now' ||
			diff < 120 && '1 minute ago' ||
			diff < 3600 && Math.floor(diff / 60) + ' minutes ago' ||
			diff < 7200 && '1 hour ago' ||
			diff < 86400 && Math.floor(diff / 3600) + " hours ago" ||
			day_diff == 1 && 'Yesterday' ||
			day_diff < 7 && day_diff + ' days ago' ||
			Math.ceil(day_diff / 7) + ' weeks ago';
});
var a = new Date('12/12/1990');
console.log(a.ago);
