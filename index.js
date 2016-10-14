var express = require('express')
var bodyParser = require('body-parser')
var pkg = require('./package')
var NodeAweber = require('aweber-api-nodejs')

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
  // We don't know what the auth callback URL will be ahead of time if we're on Heroku, but we can
  // construct it from the request.
  var callbackUrl = req.protocol + '://' + req.hostname + '/auth-callback'
  var NA = new NodeAweber(consumerKey, consumerSecret, callbackUrl)
  return NA
}

var apiToken
var apiTokenSecret

var subscribersUrl = 'accounts/' + pkg.config.accountId + '/lists/' + pkg.config.listId + '/subscribers'
var customFieldsUrl = 'accounts/' + pkg.config.accountId + '/lists/' + pkg.config.listId + '/custom_fields'

var app = express()

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send(pkg.name + ' listening on ' + port)
})

app.get('/auth', function (req, res) {
  if (apiToken || apiTokenSecret) {
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
      res.send(pkg.name + ' was able to authorize to AWeber successfully.')
    })
  }
})

app.post('/cta-get-fields', function (req, res) {
  var NA = createNA(req)
  var apiClient = NA.api(apiToken, apiTokenSecret)

  apiClient.request('get', customFieldsUrl, {}, function (err, response) {
    if (err) {
      res.json({'errors': [{'message': 'Unable to retrieve custom fields: ' + err.error.message, 'code': err.error.status + ' ' + err.error.type}]})
      res.status(500)
      res.end()
      return
    }

    var fields = [
      {
        'display_name': 'Email Address',
        'html_name': 'email_address',
        'control_type': 'text',
        'required': true,
        'active': true,
        'locked': true
      },
      {
        'display_name': 'First Name',
        'html_name': 'first_name',
        'control_type': 'text',
        'required': false,
        'active': true,
        'locked': false
      },
      {
        'display_name': 'Last Name',
        'html_name': 'last_name',
        'control_type': 'text',
        'required': false,
        'active': true,
        'locked': false
      },
      {
        'display_name': 'City',
        'html_name': 'city',
        'control_type': 'text',
        'required': false,
        'active': true,
        'locked': false
      },
      {
        'display_name': 'Region',
        'html_name': 'region',
        'control_type': 'text',
        'required': false,
        'active': true,
        'locked': false
      },
      {
        'display_name': 'Postal Code',
        'html_name': 'postal_code',
        'control_type': 'text',
        'required': false,
        'active': true,
        'locked': false
      }
    ]
    response.entries.forEach(function (customField) {
      var field = {
        'display_name': customField.name,
        'html_name': customField.name, // FIXME?
        'control_type': 'text',
        'required': false,
        'active': true,
        'locked': false
      }
      fields.push(field)
    })
    res.json(fields)
    res.status(200)
    res.end()
  }, function (error) {
    if (error.error) {
      res.json({'errors': [{'message': error.error, 'code': error.code}]})
    }
    res.status(500)
    res.end()
  })
})

app.post('/cta-submitted', function (req, res) {
  var NA = createNA(req)
  var apiClient = NA.api(apiToken, apiTokenSecret)

  var submission = req.body.submission

  var emailAddress = submission.fields.email_address
  var name = submission.fields.first_name + ' ' + submission.fields.last_name

  // Try creating the subscriber.
  var subscriber = {
    'ws.op': 'create',
    'ip_address': submission.ip_address,
    'email': emailAddress,
    'name': name
    // TODO: any built-in fields we want to support creating
    // TODO: any custom fields we want to support creating
  }
  apiClient.request('post', subscribersUrl, subscriber, function (err, response) {
    if (err) {
      // If a subscriber with that email address already exists, we want to update it.
      if (err.error.status === 400 && err.error.type === 'WebServiceError' && err.error.message === 'email: Subscriber already subscribed.') {
        apiClient.request('get', subscribersUrl, {
          'ws.op': 'find',
          'email': emailAddress
        }, function (err, response) {
          if (err) {
            res.json({'errors': [{'message': 'Unable to find subscriber with email \'' + emailAddress + '\': ' + err.error.message, 'code': err.error.status + ' ' + err.error.type}]})
            res.status(500)
            res.end()
            return
          }

          if (response.entries.length !== 1) {
            res.json({'errors': [{'message': 'There are ' + response.entries.length + ' subscribers with email \'' + emailAddress + '\' when exactly 1 was expected.'}]})
            res.status(500)
            res.end()
            return
          }

          subscriber = {
            'name': name
            // TODO: any built-in fields we want to support updating
            // TODO: any custom fields we want to support updating
          }
          apiClient.request('patch', subscribersUrl + '/' + response.entries[0].id, subscriber, function (err, response) {
            if (err) {
              res.json({'errors': [{'message': 'Unable to update subscriber ' + response.entries[0].id + ': ' + err.error.message, 'code': err.error.status + ' ' + err.error.type}]})
              res.status(500)
              res.end()
              return
            }

            // The existing subscriber was updated successfully.
            res.status(200)
            res.end()
            return
          })
        })
      } else {
        res.json({'errors': [{'message': 'Unable to create subscriber for email \'' + emailAddress + '\': ' + err.error.message, 'code': err.error.status + ' ' + err.error.type}]})
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
