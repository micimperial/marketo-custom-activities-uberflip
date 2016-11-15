var express = require('express')
// var bodyParser = require('body-parser')
// var url = require('url')
// var pkg = require('./package')
// var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var app = express()
	// Default Variables
var clientId = "";
var clientSecret = "";
var token = "";
var urlId = "";
// Connection URL
// var dbUrl = 'mongodb://admin:admin@ds061278.mlab.com:61278/aweber';
//Check DB for defaults
//MongoClient.connect(dbUrl, function (err, db) {
//	assert.equal(null, err);
//	db.collection("tokens").findOne({}, function (err, res) {
//		assert.equal(null, err);
//		if (res != null) {
//			apiToken = res.apiToken;
//			apiTokenSecret = res.apiTokenSecret;
//		}
//		console.log(apiTokenSecret)
//		db.close();
//	});
//});
//Get Fields
app.post('/get-fields', function (req, res) {
//	console.dir(req);
//	var fields = [
//			{
//				'display_name': 'Email Address'
//				, 'html_name': 'email_address'
//				, 'control_type': 'text'
//				, 'required': true
//				, 'active': true
//				, 'locked': true
//      }
//			, {
//				'display_name': 'First Name'
//				, 'html_name': 'first_name'
//				, 'control_type': 'text'
//				, 'required': false
//				, 'active': true
//				, 'locked': false
//      }
//			, {
//				'display_name': 'Last Name'
//				, 'html_name': 'last_name'
//				, 'control_type': 'text'
//				, 'required': false
//				, 'active': true
//				, 'locked': false
//      }
//    ]
//	res.json(fields)
//	res.status(200)
//	res.end()
});
//Submit
//app.post('/submit', function (req, res) {
//	console.dir(req);
//	res.status(200)
//	res.end()
//});
