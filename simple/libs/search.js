/**
 * Module dependencies
 */
var request = require('superagent');
/**
 * Search function
 * 
 * @param {String} search query
 * @param {Function} callback
 * @api public
 */
module.exports.search = function(url, query, fn) {
 	request.get(url || 'http://search.twitter.com/search.json')
 			.send({ q: query })
 			.set('Date', new Date())
 			.end(function(res) {
 				if(res.body && Array.isArray(res.body.results)) {
 					return fn(null, res.body.results);
 				}
 				fn(new Error("Bad response"));
 			});
};
// module.exports.get = {};
// module.exports.get.home = function(req, res, next) {};
// module.exports.post = {};
// module.exports.post.create = function(req, res, next) {};