var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var pkg = require('./package');
var Marketo = require('node-marketo-rest');
//var MongoClient = require('mongodb').MongoClient, assert = require('assert');
//var url = 'mongodb://admin:admin@ds061278.mlab.com:61278/aweber';
var port = process.env.PORT;
var app = express();
// Vars from POST
var endpoint;
var identity;
var clientId;
var clientSecret;
var marketo;
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
//Functions
function loadUser(req, res) {
	var userVars = req.query.vars.split("|")
	marketo = new Marketo({
		endpoint: userVars[0] + '/rest'
		, identity: userVars[0] + '/identity'
		, clientId: userVars[1]
		, clientSecret: userVars[2]
	});
}

function saveUser() {}

function setUser() {}

function getToken() {}

function getFields() {}

function getLeadId() {
	marketo.lead.find('id', [53560]).then(function (data, res) {
		console.dir(data)
	});
}

function postCA() {}
//Routes
app.use(bodyParser.json())
app.get('/', function (req, res) {
	res.send(pkg.name + ' listening on ' + port)
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
	console.dir(req.body)
	res.json(fields)
	res.status(200)
	res.end()
}, function error(error) {
	if (error.error) {
		res.json({
			'errors': [{
				'message': error.error
				, 'code': error.code
				}]
		})
	}
})
app.post('/submit', function (req, res) {
	loadUser(req, res);
	marketo.lead.find('id', [53560]).then(function (data, res) {
		console.dir(data)
	});
});
app.listen(port, function () {
	console.log(pkg.name + ' listening on port ' + port)
})
