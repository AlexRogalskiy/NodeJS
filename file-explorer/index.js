var fs = require('fs');
//console.log(fs.readdirSync(__dirname));

function async(err, files) {
	if(err) console.error(err);
	console.log(files);
}
fs.readdir('.', async);