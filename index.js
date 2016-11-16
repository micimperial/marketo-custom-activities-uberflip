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
//https://uf-marketo-custom-activies.herokuapp.com/submit?vars=6aa50fbb-8bc3-4d0b-8d70-e9c7c7afbb99|sPqipzHSR65mt2WqwzszK7zcVYEWrwJp|735-CWI-679
function loadUser(req, res) {
	console.log(req.query.vars)
	var userVars = req.query.vars.split("|")
	marketo = new Marketo({
		clientId: userVars[0]
		, clientSecret: userVars[1]
		, endpoint: 'https://' + userVars[2] + '.mktorest.com//rest'
		, identity: 'https://' + userVars[2] + '.mktorest.com//identity'
	});
}

function saveUser() {}

function setUser() {}

function getToken() {}

function getFields() {}

function postCA() {}
//Routes
app.use(bodyParser.json())
app.get('/', function (req, res) {
	res.send(pkg.name + ' listening on ' + port)
})
app.post('/get-fields', function (req, res) {
	loadUser(req, res);
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
	console.dir(req.cookies);
	console.log('---------------------------');
	console.dir(req.body);
	loadUser(req, res);
	marketo.lead.createOrUpdate('id', [53560]).then(function (data, res) {
		console.dir(data)
	}).then(function(){
		//Custom Activity
	})
	res.end()
	return
	});
app.listen(port, function () {
	console.log(pkg.name + ' listening on port ' + port)
})
