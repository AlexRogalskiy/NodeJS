/**
 * Module dependencies
 */
//var uniqueRandomArray = require('unique-random-array');
var config = require('./config');

module.exports =
{
	getFortuneAll: getAll,
	getFortune: random,
	getFortuneArray: randomArray
};

var getRandomItem = uniqueRandomArray('./config.json');

function getAll() {
	return config.vars.fortunes;
};

function random() {
	var index = Math.floor(Math.random() * config.vars.fortunes.length);
	return config.vars.fortunes[index];
};

function randomArray(number) {
	if(number === undefined) {
		return getRandomItem();
	}
	var randomItems = [];
	for(var i=0; i<number; i++) {
		randomItems.push(getRandomItem());
	}
	return randomItems;
};