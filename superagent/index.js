var request = require('superagent');

request.get('http://twitter.com/search.json')
		.send({q: 'j b'})
		.set('Date', new Date())
		.end(function(res) {
			console.log(res.text);
			console.log(res.body);
});

request.post('http://example.com')
		.send({json: 'encoded'})
		.end();