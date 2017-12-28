window.onload = function() {
	var socket = io.connect();
	socket.on('connect', function() {
		socket.emit('join', prompt('What is your nickname?'));
	});
};