var fs = require('fs');
var stdin = process.stdin;
var stdout = process.stdout;
//console.log(fs.readdirSync(__dirname));

fs.readdir(process.cwd(), function(err, files) {
	if(err) console.error(err);
	if(!files.length) {
		return console.log('\033[31mNo files to show\033[39m\n');
	}
	console.log(files);
	console.log('Select file or directory to list: ');

	var stats = [];

	function file(i) {
		var filename = files[i];
		fs.stat(__dirname + '/' + filename, function(err, stat) {
			stats[i] = stat;
			if(stat.isDirectory()) {
				console.log(' > ' + i + ' \033[36m' + filename + '/\033[39m');
			} else {
				console.log(' > ' + i + ' \033[90m' + filename + '\033[39m');
			}
			i++;
			if(i == files.length) {
				read();
			} else {
				file(i);
			}
		});
	}

	function read() {
		console.log('');
		stdout.write('\033[33mEnter your choice: \033[39m');

		stdin.resume();
		stdin.setEncoding('utf8');
		stdin.on('data', option);
	}

	function option(data) {
		var filename = ('\r\n' == data) ? null : files[Number(data)];
		if(!filename) {
			stdout.write('\033[31mEnter your choice: \033[39m');
		} else {
			stdin.pause();
			if(stats[Number(data)].isDirectory()) {
				fs.readdir(__dirname + '/' + filename, function(err, files) {
					console.log('');
					console.log('\t(' + files.length + ' files)');
					files.forEach(function(file) {
						console.log('\t\t - ' + file);
					});
					console.log('');
				});
			} else {
				fs.readFile(__dirname + '/' + filename, 'utf8', function(err, data) {
					console.log('');
					console.log('\033[90m' + data.replace(/(.*)/g, '\t$1') + '\033[39m');
				})
			}
		}
	}
	file(0);
});