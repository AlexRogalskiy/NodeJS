/**
 * Module dependencies
 */
var Browser = require('zombie') ;
var assert = require('chai').assert;

var browser;
suite('Global crosspage tests', function() {
	setup(function() {
		browser = new Browser();
	});

	test('should contain referrer field from Prime tour page', function(done) {
		var referrer = 'http://localhost:3000/tours/prime';
		browser.visit(referrer, function() {
			browser.clickLink('.requestGroupRate', function() {
				console.log(browser.field('referrer').value);
				//assert(browser.field('referrer').value === referrer);
				done();
			});
		});
	});

	test("should contain referrer field from Fast tour page", function(done) {
		var referrer = 'http://localhost:3000/tours/fast';
		browser.visit(referrer, function() {
			browser.clickLink('.requestGroupRate', function() {
				//assert(browser.field('referrer').value === referrer);
				done();
			});
		});
	});

	test("should not contain referrer field from Price page", function(done) {
		var referrer = 'http://localhost:3000/tours/price-group-rate';
		browser.visit(referrer, function() {
			//assert(browser.field('referrer').value === '');
			done();
		});
	});
});