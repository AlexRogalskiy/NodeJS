/**
 * Module dependencies
 */
var User = require('./index');

var testUsers = {
	'm@f.com' : { name: 'M' },
	'b@f.com' : { name: 'B' },
	'c@f.com' : { name: 'C' }
};

function create(users, fn) {
	var total = Object.keys(users).length;
	for(var i in users) {
		(function(email, data) {
			var user = new User(email, data);
			user.save(function(err) {
				if(err) throw err;
				--total || fn();
			});
		})(i, users[i]);
	}
};

function hydrate(users, fn) {
	var total = Object.keys(users).length;
	for(var i in users) {
		(function(email) {
			User.find(email, function(err, user) {
				if(err) throw err;
				users[email] = user;
				--total || fn();
			});
		})(i);
	}
};

create(testUsers, function() {
	hydrate(testUsers, function() {
		console.log(testUsers);
	});
	//console.log('all users created');
	//process.exit();
});
