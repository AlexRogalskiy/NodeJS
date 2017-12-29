/**
 * Module dependencies
 */
var assert = require('assert');
var expect = require('expect.js');
var add = require('./add');

// var now = Date.now();
// assert.ok(now % 2 == 0);

var str = "abty";
assert.ok(~str.indexOf('b'));

expect(str).to.contain('b');

expect(1).to.be.ok();
expect(true).to.be.ok();
expect({}).to.be.ok();
expect(0).to.not.be.ok();

expect(1).to.be(1)
expect(NaN).not.to.equal(NaN);
expect(1).not.to.be(true)
expect('1').to.not.be(1);

expect({ a: 'b' }).to.eql({ a: 'b' });
expect(1).to.eql('1');

// typeof with optional `array`
expect(5).to.be.a('number');
expect([]).to.be.an('array');  // works
expect([]).to.be.an('object'); // works too, since it uses `typeof`

// constructors
expect([]).to.be.an(Array);
// expect(tobi).to.be.a(Ferret);
// expect(person).to.be.a(Mammal);

var version = "3.3.3";
expect(version).to.match(/[0-9]+\.[0-9]+\.[0-9]+/);

expect([1, 2]).to.contain(1);
expect('hello world').to.contain('world');

expect([]).to.have.length(0);
expect([1,2,3]).to.have.length(3);

expect([]).to.be.empty();
expect({}).to.be.empty();
expect({ length: 0, duck: 'typing' }).to.be.empty();
expect({ my: 'object' }).to.not.be.empty();
expect([1,2,3]).to.not.be.empty();

// expect(window).to.have.property('expect')
// expect(window).to.have.property('expect', expect)
expect({a: 'b'}).to.have.property('a');

expect({ a: 'b' }).to.have.key('a');
expect({ a: 'b', c: 'd' }).to.only.have.keys('a', 'c');
expect({ a: 'b', c: 'd' }).to.only.have.keys(['a', 'c']);
// expect({ a: 'b', c: 'd' }).to.not.only.have.key('a');

// expect(fn).to.throw(); // synonym of throwException
// expect(fn).to.throwError(); // synonym of throwException
// expect(fn).to.throwException(function (e) { // get the exception object
//   expect(e).to.be.a(SyntaxError);
// });
// expect(fn).to.throwException(/matches the exception message/);
// expect(fn2).to.not.throwException();

// expect(fn).withArgs(invalid, arg).to.throwException();
// expect(fn).withArgs(valid, arg).to.not.throwException();

expect(1).to.be.within(0, Infinity);

expect(3).to.be.above(0);
expect(5).to.be.greaterThan(3);

expect(0).to.be.below(3);
expect(1).to.be.lessThan(3);

// expect().fail()
// expect().fail("Custom failure message")
