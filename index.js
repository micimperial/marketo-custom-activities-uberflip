var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var pkg = require('./package');
var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');
var url = 'mongodb://admin:admin@ds061278.mlab.com:61278/aweber';
// Defaults
var app = express();
var apiId;
var apiToken;
var apiSecret;
var apiUrl;
//Check DB
//MongoClient.connect(url, function (err, db) {
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
app.use(bodyParser.json())
app.get('/', function (req, res) {
	res.send(pkg.name + ' listening on ' + port)
})
app.listen(port, function () {
	console.log(pkg.name + ' listening on port ' + port)
})
app.post('/get-fields', function (req, res) {
	var fields = [
		{
			'display_name': 'Email Address'
			, 'html_name': 'email_address'
			, 'control_type': 'text'
			, 'required': true
			, 'active': true
			, 'locked': true
      }
			, {
			'display_name': 'First Name'
			, 'html_name': 'first_name'
			, 'control_type': 'text'
			, 'required': false
			, 'active': true
			, 'locked': false
      }
			, {
			'display_name': 'Last Name'
			, 'html_name': 'last_name'
			, 'control_type': 'text'
			, 'required': false
			, 'active': true
			, 'locked': false
      }
    ]
	res.json(fields)
	res.status(200)
	res.end()
}, function (error) {
	if (error.error) {
		res.json({
			'errors': [{
				'message': error.error
				, 'code': error.code
				}]
		})
	}
	res.status(500)
	res.end()
})
