var express = require('express')
var bodyParser = require('body-parser')
var url = require('url')
var pkg = require('./package')
var NodeAweber = require('aweber-api-nodejs')
var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');
// Connection URL
var url = 'mongodb://admin:admin@ds061278.mlab.com:61278/aweber';
var port = process.env.PORT
if (!port) {
	console.error('Error: The PORT environment variable is not set.')
	process.exit(1)
}
var consumerKey = process.env.CONSUMER_KEY
if (!consumerKey) {
	console.error('Error: The CONSUMER_KEY environment variable is not set.')
	process.exit(1)
}
var consumerSecret = process.env.CONSUMER_SECRET
if (!consumerSecret) {
	console.error('Error: The CONSUMER_SECRET environment variable is not set.')
	process.exit(1)
}
var createNA = function (req) {
	var callbackUrl = req.protocol + '://' + req.hostname + '/auth-callback'
	var NA = new NodeAweber(consumerKey, consumerSecret, callbackUrl)
	return NA
}
var apiToken
var apiTokenSecret
	//Check DB
MongoClient.connect(url, function (err, db) {
	assert.equal(null, err);
	db.collection("tokens").findOne({}, function (err, res) {
		assert.equal(null, err);
		if (res != null) {
			apiToken = res.apiToken;
			apiTokenSecret = res.apiTokenSecret;
		}
		console.log (apiTokenSecret)
		db.close();
	});
});
var accountId
var listId
var subscribersUrl
var customFieldsUrl
var app = express()

function rewriteUrls(req) {
	accountId = req.query.vars.split("|")[0]
	listId = req.query.vars.split("|")[1]
	console.log(listId + ' – ' + accountId)
	subscribersUrl = 'accounts/' + accountId + '/lists/' + listId + '/subscribers'
	customFieldsUrl = 'accounts/' + accountId + '/lists/' + listId + '/custom_fields'
}
app.use(bodyParser.json())
app.get('/', function (req, res) {
	res.send(pkg.name + ' listening on ' + port)
})
app.get('/reset', function (req, res) {
	apiToken = null;
	apiTokenSecret = null;
	MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);
		db.collection("tokens").remove({});
		db.close();
	});
	res.send('Auth reset' + apiToken + ' - ' + apiTokenSecret)
	return
})
app.get('/auth', function (req, res) {
	if (apiToken && apiTokenSecret) {
		res.send(pkg.name + ' already has an AWeber API token.')
		return
	}
	var NA = createNA(req)
	NA.requestToken(function (err, response) {
		if (err) {
			res.send(pkg.name + ' wasn\'t able to authorize to AWeber.<br/>' + JSON.stringify(err))
			return
		}
		apiToken = null
		apiTokenSecret = response.oauth_token_secret
		res.redirect('https://auth.aweber.com/1.0/oauth/authorize?oauth_token=' + response.oauth_token)
	})
})
app.get('/auth-callback', function (req, res) {
	if (apiToken) {
		res.send(pkg.name + ' already has an AWeber API token.')
		return
	}
	if (req.query.oauth_token && req.query.oauth_verifier) {
		var NA = createNA(req)
		NA.accessToken(req.query.oauth_token, req.query.oauth_verifier, apiTokenSecret, function (err, response) {
			if (err) {
				res.send(pkg.name + ' wasn\'t able to authorize to AWeber.<br/>' + JSON.stringify(err))
				return
			}
			apiToken = response.oauth_token
			apiTokenSecret = response.oauth_token_secret
				//Check DB
			MongoClient.connect(url, function (err, db) {
				assert.equal(null, err);
				db.collection("tokens").remove({});
				db.collection("tokens").insert({
					"apiToken": apiToken
					, "apiTokenSecret": apiTokenSecret
				});
				db.close();
			});
			res.send(pkg.name + ' was able to authorize to AWeber successfully.')
		})
	}
})
app.post('/cta-get-fields', function (req, res) {
	rewriteUrls(req)
	var NA = createNA(req)
	var apiClient = NA.api(apiToken, apiTokenSecret)
	apiClient.request('get', customFieldsUrl, {}, function (err, response) {
		if (err) {
			res.json({
				'errors': [{
					'message': 'Unable to retrieve custom fields: ' + err.error.message
					, 'code': err.error.status + ' ' + err.error.type
				}]
			})
			res.status(500)
			res.end()
			return
		}
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
		response.entries.forEach(function (customField) {
			var field = {
				'display_name': customField.name
				, 'html_name': customField.name
				, 'control_type': 'text'
				, 'required': false
				, 'active': true
				, 'locked': false
			}
			fields.push(field)
		})
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
})
app.post('/cta-submitted', function (req, res) {
	rewriteUrls(req)
	var NA = createNA(req)
	var apiClient = NA.api(apiToken, apiTokenSecret)
	var submission = req.body.submission
	var emailAddress = submission.fields.email_address
	var name = ((submission.fields.first_name != '' && submission.fields.last_name != '') ? submission.fields.first_name + ' ' + submission.fields.last_name : '');
	var ufNotes = 'From Uberflip CTA with ID-' + req.body.cta_id;
	var ufTags = (typeof submission.fields.tags !== 'undefined' && submission.fields.tags !== null) ? JSON.stringify(submission.fields.tags.split(',')) : '';
	var ufCustomFields = JSON.stringify(submission.fields);
	// Try creating the subscriber.
	var subscriber = {
		'ws.op': 'create'
		, 'ip_address': submission.ip_address
		, 'email': emailAddress
		, 'name': name
		, 'misc_notes': ufNotes
		, 'tags': ufTags
		, 'custom_fields': ufCustomFields
	}
	console.log(JSON.stringify(NA));
	console.log(JSON.stringify(subscriber));
	apiClient.request('post', subscribersUrl, subscriber, function (err, response) {
		if (err) {
			console.log(err)
				// If a subscriber with that email address already exists, we want to update it.
			if (err.error.status === 400 && err.error.type === 'WebServiceError' && err.error.message === 'email: Subscriber already subscribed.') {
				apiClient.request('get', subscribersUrl, {
					'ws.op': 'find'
					, 'email': emailAddress
				}, function (err, response) {
					if (err) {
						res.json({
							'errors': [{
								'message': 'Unable to find subscriber with email \'' + emailAddress + '\': ' + err.error.message
								, 'code': err.error.status + ' ' + err.error.type
							}]
						})
						res.status(500)
						res.end()
						return
					}
					if (response.entries.length !== 1) {
						res.json({
							'errors': [{
								'message': 'There are ' + response.entries.length + ' subscribers with email \'' + emailAddress + '\' when exactly 1 was expected.'
							}]
						})
						res.status(500)
						res.end()
						return
					}
					var subscriberId = '' + response.entries[0].id;
					console.dir(subscriber);
					apiClient.request('patch', subscribersUrl + '/' + subscriberId, subscriber, function (err, response) {
						console.log(subscriberId);
						if (err) {
							console.dir(err);
							res.json({
								'errors': [{
									'message': 'Unable to update subscriber ' + subscriberId + ': ' + err.error.message
									, 'code': err.error.status + ' ' + err.error.type
								}]
							})
							res.status(500)
							res.end()
							return
						}
						console.dir(response);
						// The existing subscriber was updated successfully.
						res.status(200)
						res.end()
						return
					})
				})
			}
			else {
				res.json({
					'errors': [{
						'message': 'Unable to create subscriber for email \'' + emailAddress + '\': ' + err.error.message
						, 'code': err.error.status + ' ' + err.error.type
					}]
				})
				res.status(500)
				res.end()
			}
			return
		}
		// The new subscriber was created successfully.
		res.status(200)
		res.end()
		return
	})
})
app.listen(port, function () {
	console.log(pkg.name + ' listening on port ' + port)
})
