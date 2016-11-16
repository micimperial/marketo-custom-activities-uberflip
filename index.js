var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var pkg = require('./package');
var Marketo = require('node-marketo-rest');
var cookie = require('cookie');
var port = process.env.PORT;
var app = express();
// Vars from POST
var endpoint;
var identity;
var clientId;
var clientSecret;
var marketo;
var customActivity;

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
		var results = data.result;
		results.forEach(function (data) {
			var field = {
				'display_name': data.displayName
				, 'html_name': data.rest.name
				, 'control_type': 'text'
				, 'required': false
				, 'active': false
				, 'locked': false
			}
			console.dir(field);
			fields.push(field)
		})
			res.json(fields)
	res.status(200)
	res.end()
	})

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
	console.log('COOKIE: '+req.cookies);
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
