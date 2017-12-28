var fs = require('fs');

fs.readFile('LICENSE', function(err, data) {
	if(err) return console.error(err);
	console.log(data);
});

console.log(1);
process.nextTick(function() {
	console.log(3);
});
console.log(2);

process.on('uncaughtException', function(err) {
	console.error(err);
	process.exit(1);
});