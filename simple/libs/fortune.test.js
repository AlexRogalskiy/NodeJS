//var expect = require('chai').expect;
//var testData = require('./index');
import {expect} from 'chai';
import testData from './index';

describe('test', function() {
	it('should work!', function() {
		expect(true).to.be.true;
	});
});

describe('test', function() {
	describe('all', function() {
		it('should be an array of array of strings', function() {
			expect(testData.all).to.satisfy(isArrayOfArrayOfStrings);
			
			function isArrayOfArrayOfStrings(array) {
				return array.every(function(item) {
					if(typeof item === 'object') {
						return item.every(function(item2) {
							return (typeof item2 === 'string');
						});
					}
					return false;
				});
			}
		});
		
		it('should contain <["An unexamined life is not worth living.", "Socrates"]>', function() {
			expect(testData.all).to.include.deep.members([["An unexamined life is not worth living.", "Socrates"]]);
		});
	});
	
	describe('random', function() {
		it('should return a random item from the testData.all', function() {
			var randomItem = testData.random();
			expect(testData.all).to.include(randomItem);
		});
		
		it('should return an array of random items if passed a number', function() {
			var randomItems = testData.random(3);
			expect(randomItems).to.have.length(3);
			randomItems.forEach(function(item) {
				expect(testData.all).to.include(item);
			});
		})
	});
});