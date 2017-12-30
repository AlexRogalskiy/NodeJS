/**
 * Module dependencies
 */
var express = require('express');

var app = module.exports = express.createServer();
app.get('/', function(req, res, next) {});
app.get('/categories', function(req, res, next) {});
app.get('/search', function(req, res, next) {});