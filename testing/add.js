(function(module) {
	module.exports = function(a, b) {
		return a + b;
	};

	if('undefined' != typeof window) {
		window.add = module.exports;
	}
})('undefined' == typeof module ? { module: { exports: {} } } : module);

if(!Function.prototype.bind) {
	Function.prototype.bind = function() {

	};
}

var keys = Object.keys || function(obj) {
	var ret = [];
	for(var i in obj) {
		if(Object.prototype.hasOwnProperty.call(obj, i)) {
			ret.push(i);
		}
	}
	return ret;
};

function inherits(a, b) {
	function c() {};
	c.prototype = b.prototype;
	a.prototype = new c;
};
//a.prototype.__proto__ = b.prototype;
// function a() {};
// function b() {};
//inherits(a, b);
