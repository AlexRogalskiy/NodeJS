/**
 * Module dependencies
 */
var expect = require('expect.js');
var pug = require('pug');

describe('pug.render', function() {
	it('should render a paragraph', function() {
		expect(pug.render('p A paragraph')).to.be('<p>A paragraph</p>');
	});
});