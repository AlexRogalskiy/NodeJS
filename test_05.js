var EventEmitter = require('events').EventEmitter;
var a = new EventEmitter;
a.on('event', function() {
	console.log('event called');
});
a.emit('event');

var cl = function() {};
cl.prototype.__proto__ = EventEmitter.prototype;
var a = new cl;
a.on('event', function() {
	console.log('a on event');
});
a.once('event', function() {
	console.log('test');
});
a.emit('event');

var buffer = new Buffer('R0lGODlhEAAOALMAAOazToeHh0tLS/7LZv/0j vb29t/f3//Ub//ge8WSLf/rhf/3kdbW1mxsbP//mf///yH5BAAAAAAALAAAAAAQAA4AAA Re8L1Ekyky67QZ1hLnjM5UUde0ECwLJoExKcppV0aCcGCmTIHEIUEqjgaORCMxIC6e0Cc guWw6aFjsVMkkIr7g77ZKPJjPZqIyd7sJAgVGoEGv2xsBxqNgYPj/gAwXEQA7', 'base64');
console.log(buffer);
require('fs').writeFile('logo.png', buffer);

