var http = require('http');
var qs = require('querystring');

// var search = process.argv.slice(2).join('').trim();
// if(!search.length) {
// 	return console.log('\n Usage: node index <search-term>\n');
// }
// console.log('\n Searching for: \033[96m' + search + '\033[39m\n');

function send(host, search) {
	var client = http.request({
		//host: '127.0.0.1',
		host: host,
		//port: 3000,
		//url: '/',
		path: '/search.json?' + qs.stringify({q: search}),
		method: 'GET'
	}, function(res) {
		var body = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			console.log('\n Response: \033[96m' + body + '\033[39m\n');
			var obj = JSON.parse(body);
			obj.results.forEach(function(tweet) {
				console.log('\033[90m' + tweet.text + '\033[39m');
				console.log('\033[94m' + tweet.from_user + '\033[39m');
				console.log('--');
			});
		});
	}).end();//qs.stringify({name : theName})
}

process.stdout.write('\n Name: ');
process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', function(name) {
	send('search.twitter.com', name.replace('\n', ''));
});