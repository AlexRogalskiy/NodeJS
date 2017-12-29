/**
 * Module dependencies
 */
var mysql = require('mysql');
var config = require('./config');

delete config.database;
var db = mysql.createConnection(config);

db.on('error', function(data) {
	console.log('ERROR: ' + data);
});
db.query('create database if not exists cartdb', function(err) {
	if(err) console.log(err);
});
db.query('use cartdb', function(err) {
	if(err) console.log(err);
});
db.query('drop table if exists item', function(err) {
	if(err) console.log(err);
});
db.query('create table item (' + 
	'id int(11) auto_increment,' + 
	'title varchar(255),' + 
	'description text,' +
	'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
	'primary key (id))', function(err) {
	if(err) console.log(err);
});
db.query('drop table if exists review', function(err) {
	if(err) console.log(err);
});
db.query('create table review(' +
		'id int(11) auto_increment,' +
		'item_id int(11),' +
		'text text,' +
		'stars int(1),' +
		'created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
		'primary key (id))', function(err) {
	if(err) console.log(err);
});
db.end(function() {
	console.log('Connection closed');
});