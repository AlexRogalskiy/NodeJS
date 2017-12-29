/**
 * Module dependencies
 */
var expect = require('expect.js');
var assert = require('assert');
var add = require('./add');

describe('test suite', function () {
	it('should expose a function', function () {
		expect(add).to.be.a('function');
	});

	it('should do math', function () {
    	expect(add(1, 3)).to.equal(4);
  	});

  	  it('should not throw', function() {
		this.timeout(100);
		setTimeout(function() {
			assert.ok(1 == 1);
		}, 1000);
	});

  	it('will not fail', function() {
		this.timeout(100);
		setTimeout(function() {
			//
		}, 1000);
	});

	it('will not fail 2', function(done) {
		setTimeout(function() {
			assert.ok(1 == 1);
			done();
		}, 1000);
	});

	it('will not fail 3', function(done) {
		var total = 3;
		setTimeout(function() {
			assert.ok(1 == 1);
			--total || done();
		}, 1000);
		setTimeout(function() {
			assert.ok(1 == 1);
			--total || done();
		}, 1000);
		setTimeout(function() {
			assert.ok(1 == 1);
			--total || done();
		}, 1000);
	});
});

// mocha.setup('bdd');
// window.onload = function() {
// 	mocha.run();
// };