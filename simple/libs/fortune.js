/**
 * Module dependencies
 */
var config = require('./config');

module.exports.getFortune = function() {
	var index = Math.floor(Math.random() * config.vars.fortunes.length);
	return config.vars.fortunes[index];
};