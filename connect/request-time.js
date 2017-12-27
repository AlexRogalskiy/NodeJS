/**
 * Module dependencies
 */
// var connect = require('connect');

// var server = connect.createServer();
// server.use(connect.static(__dirname + '/website'));
// server.use(connect.logger('dev'));
// server.listen(3000);

/**
 * Request time middleware
 *
 * Options:
 *		- 'time' ('Number'): number of ms before logging (100)
 *
 * @param {Object} options
 * @api public
 */
module.exports = function(options) {
	var time = options.time || 100;
	return function(req, res, next) {
		var timer = setTimeout(function() {
			console.log(req.method, req.url);
		}, time);

		var end = res.end;
		res.end = function(chunk, encoding) {
			res.end = end;
			res.end(chunk, encoding);
			clearTimeout(times);
		};
		next();
	}
}