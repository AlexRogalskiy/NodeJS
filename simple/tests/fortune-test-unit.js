/**
 * Module dependencies
 */
 var fortune = require('../libs/fortune.js');
 var expect = require('chai').expect;

 suite('Fortunes tests', function() {
 	test('should return fortune', function() {
 		expect(typeof fortune.getFortune() === 'string');
 	});
 });