var net = require('net');

var count = 0;
var users = {};

var server = net.createServer(function(connection) {
	var nickname;
	console.log('\033[90m new connection established\033[39m');
	connection.write('\n > welcome to \033[93mnode-chat\033[39m' +
			   		 '\n > ' + count + ' total peers connected' +
			   		 '\n > Please enter your name and press enter: '
	);

	connection.setEncoding('utf8');
	connection.on('data', function(data) {
		// console.log(data.toString('utf8'));
		data = data.replace('\r\n', '');
		if(!nickname) {
			if(users[data]) {
				connection.write('\033[93m> nickname already in use, try again: \033[39m');
				return;
			} else {
				nickname = data;
				users[nickname] = connection;
				broadcast('\033[90m > ' + nickname + ' joined the space\033[39m\n');
			}
		} else {
			broadcast('\033[96m > ' + nickname + ':\033[39m ' + data + '\n', true);
		}
		console.log(data);
	});

	connection.on('end', function() {
		console.log('End');
	});

	connection.on('error', function() {
		console.log('Error');
	});

	connection.on('close', function() {
		console.log('Disconnected');
		count--;
		delete users[nickname];
		broadcast('\033[90m > ' + nickname + ' left the space\033[39m\n');
	});
	count++;

	function broadcast(message, exceptFlag) {
		for(var i in users) {
			if(!exceptFlag || i != nickname) {
				users[i].write(message);
			}
		}
	}
});

server.listen(3000, function() {
	console.log('\033[96m server listening on *: 3000\033[39m');
});