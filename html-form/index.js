var http = require('http');
var qs = require('querystring');

var server = http.createServer(function(req, res) {
	if('/' == req.url) {
		res.writeHead(200, { 'Content-Type' : 'text/html' });
		res.end([
			'<form method="POST" action="/url">',
			'<h1>Form</h1>',
			'<fieldset>',
			'<label>Personal INFO</label>',
			'<p>Your name, please&</p>',
			'<input type="text" name="name">',
			'<p><button>Submit</button></p>',
			'</fieldset>',
			'</form>'
		].join(''));
	} else if('/url' == req.url && 'POST' == req.method) {
		var body = '';
		req.on('data', function(chunk) {
			body += chunk;
		});
		req.on('end', function() {
			res.writeHead(200, { 'Content-Type' : 'text/html' });
			res.write('Content-Type: ' + req.headers['content-type']);
			res.write('Data: ' + body);
			res.write('Name: ' + qs.parse(body).name);
			res.end('You sent request by: ' + req.method + ' end of');
		});
	} else {
		res.writeHead(404);
		res.end('Not found');
	}
});
server.listen(3000);

//console.log(require('querystring').parse('name=d'));
//console.log(require('querystring').parse('q=q'));