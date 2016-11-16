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
function loadUser(req) {
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
app.all('/get-fields', function (req, res) {
	loadUser(req);
	var fields = [];
	marketo.lead.describe().then(function (data) {
		console.dir(data.result);
		data.result.forEach(function (data) {
			var field = {
				'display_name': data.displayName
				, 'html_name': data.rest.name
				, 'control_type': 'text'
				, 'required': false
				, 'active': true
				, 'locked': false
			}
			fields.push(field)
		})
	})
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
	loadUser(req);
	marketo.lead.createOrUpdate(req.body.submission.fields).then(function (data, res) {
		console.dir(data)
	})
	res.end()
	return
});
app.listen(port, function () {
	console.log(pkg.name + ' listening on port ' + port)
})
