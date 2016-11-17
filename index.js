var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var pkg = require('./package');
var request = require('request');
var moment = require("moment")
var Marketo = require('node-marketo-rest');
var port = process.env.PORT;
var app = express();
// Vars from POST
var endpoint;
var identity;
var clientId;
var clientSecret;
var listId;
var marketo;
var customActivity;
var primaryAttributeValue;
var userVars;

function loadUser(req) {
	//console.log(req.query.vars)
	userVars = req.query.vars.split("|")
	marketo = new Marketo({
		clientId: userVars[0]
		, clientSecret: userVars[1]
		, endpoint: 'https://' + userVars[2] + '.mktorest.com/rest'
		, identity: 'https://' + userVars[2] + '.mktorest.com/identity'
	});
	listId = userVars[3];
	customActivity = userVars[4];
}
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
	loadUser(req);
	var lead = req.body.submission.fields;
	delete lead['primaryAttributeValue'];
	console.log(lead);
//	console.log(parseInt(listId));
//	https://github.com/MadKudu/node-marketo/issues/33
//	marketo.list.addLeadsToList().then(function (data, res) {
	marketo.lead.createOrUpdate([lead]).then(function (data, res) {
//		console.log('res: '+res);
//		console.log(JSON.stringify(data));
//		var token = marketo._connection._tokenData.access_token
//		var now = moment();
//		var activity = {
//			"input": [
//				{
//					"leadId": data.result[0].id || 0
//					, "activityDate": now.format("YYYY-MM-DDThh:mm:ssTZD")
//					, "activityTypeId": customActivity || null
//					, "primaryAttributeValue": req.body.submission.fields.primaryAttributeValue || null
//      			}
//  			]
//		}
//
//		request('https://' + userVars[2] + '/rest/v1/activities/external.json?access_token='+token, function (error, response, body) {
//			if (!error && response.statusCode == 200) {
//				console.log(body) // Show the HTML for the Google homepage.
//			}
//		})
	})
	res.end()
	return
});
app.listen(port, function () {
	console.log(pkg.name + ' listening on port ' + port)
})
