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
	console.log(req.query.vars)
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
	console.log(req);
	loadUser(req);
	var lead = req.body.submission.fields;
	primaryAttributeValue = req.body.submission.fields.primaryAttributeValue;
	delete lead['primaryAttributeValue'];
	lead.uf_conversion_item_id = req.body.cta_id || ""
	lead.uf_conversion_item_title = req.body.submission.url || ""
		//	https://github.com/MadKudu/node-marketo/issues/33
		//	marketo.list.addLeadsToList().then(function (data, res) {
	marketo.lead.createOrUpdate([lead]).then(function createCustomActivity(data, res) {
		//	console.log(JSON.stringify(data));
		var token = marketo._connection._tokenData.access_token
		var now = moment().add(1, 'days');
		var leadId = data.result[0].id;
		var activity = {
				"input": [
					{
						"leadId": data.result[0].id || 0
						, "activityDate": now.format("YYYY-MM-DDThh:mm:ssZ")
						, "activityTypeId": customActivity || ""
						, "primaryAttributeValue": primaryAttributeValue || ""
      			}
  			]
			}
			//		console.dir(activity);
		request({
			url: 'https://' + userVars[2] + '.mktorest.com/rest/v1/activities/external.json?access_token=' + token
			, method: "POST"
			, json: activity
		}, function customActivityCallback(error, res, body) {
			if (!error && res.statusCode == 200) {
				//	console.log(body)
				//	console.log(leadId)
				leadJson = {
					list: listId
					, id: [leadId]
					, listOperationRequest: {
						"input": [{
							"id": leadId
						}]
					}
				};
				marketo.list.addLeadsToList(listId, [leadId])
			}
			else {
				console.log(error)
			}
		})
	})
	res.end()
	return
});
app.listen(port, function () {
	console.log(pkg.name + ' listening on port ' + port)
})
