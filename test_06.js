console.log(process.argv.slice(2));

console.log(__dirname);

process.cwd();
// process.chdir('/');
// process.cwd();

console.log(process.env.NODE_ENV);
console.log(process.env.SHELL);

// process.exit(1);

process.on('SIGKILL', function() {
	console.log('sigkill');
})

var fs = require('fs');
var stream = fs.createReadStream('LICENSE');
stream.on('data', function(chunk) {
	console.log(chunk);
});
stream.on('end', function(chunk) {
	console.log('eof');
});
var files = fs.readdirSync(process.cwd());
files.forEach(function(file) {
	if(/\.js/.test(file)) {
		//fs.watch
		fs.watchFile(process.cwd() + '/' + file, function() {
			console.log(' - ' + file + ' changed!');
		});
	}
});