# Uberflip Platform Samples: Custom Form CTA Type ([AWeber](http://aweber.com/))

## Introduction

This is a sample custom form CTA type for [Uberflip](http://www.uberflip.com/) that integrates Uberflip CTAs with the [AWeber](http://aweber.com/) email marketing platform, demonstrating how to:

* Load CTA fields from your AWeber list's custom fields
* Handle CTA submissions by adding or updating subscribers to your AWeber list

This sample was built with the following tools and services:

* [AWeber](http://aweber.com/)
* [aweber-api-nodejs](https://www.npmjs.com/package/aweber-api-nodejs/)
* [Node.js](https://nodejs.org/)
* [Express](http://expressjs.com/)
* [Heroku](https://www.heroku.com/) to host the sample

If you don't know or don't use all of these tools and services, don't worry!  This sample is extremely simple, and changing it to use something else should be relatively straightforward.

## Disclaimer

This sample was written to demonstrate how to build custom form CTA types for [Uberflip](http://www.uberflip.com/). Its code is **not** fit for production and should **not** be used in a production application without careful review.  Three examples of its unfitness for production:

* It makes no effort to authenticate the caller, and so could be used to spam your AWeber account.
* It makes no effort to queue up submissions, calling the AWeber API once per submission, and so could trigger rate limiting on your AWeber account and cause CTA submissions and other API calls to be dropped.
* It stores API tokens and secrets in memory and must be re-authorized when restarted.

Don't let these happen to you!

## Getting Started

### Sign up for an AWeber Labs developer account

[Sign up for an AWeber Labs developer account.](https://labs.aweber.com/)

### Create an app in AWeber Labs

Log into AWeber Labs and create an app:

* Click "My Apps" 
* Click "Create A New App"
* Complete the fields appropriately for your application
* Click "Create New App"
* Note the generated "Consumer Key" and "Consumer Secret" values
* Click the tools icon next to the app
* Click "Permission Settings"
* Check "Request Subscriber Data" to allow the app to access subscriber data
* Click "Save Permissions Settings"
* Click "Save"

> The sample needs an app consumer key and secret to generate an API token and secret which it will use to access the AWeber account you're integrating with.

### Sign up for a Heroku account

[Sign up for a Heroku account.](https://signup.heroku.com/)

> Heroku is a cloud Platform-as-a-Service (PaaS) popular with the open-source community. Heroku has a [free plan](https://www.heroku.com/pricing) that you can sign up for without a credit card and use to host small apps (limited to a single virtual server per app, running 18 hours/day, and sleeping after 30 minutes of inactivity).  

### Get the sample

Clone the sample from git:

```bash
git clone https://github.com/uberflip/node-custom-form-cta-type-aweber.git
cd node-custom-form-cta-type-aweber/
```

Install the dependencies:
```bash
npm install
```

(Recommended) Run the tests:
```bash
npm test
```

### Configure the sample

Edit [package.json](package.json)'s `config` object appropriately:

* `accountId`: The numeric identifier of your AWeber account.
* `listId`: The numeric identifier of the AWeber list to add the subscriber to. You can find this from AWeber's UI in *List Options > List Settings > Unique List ID*. You will need to remove the letters from the identifier and use only the number.

### Deploy the sample to Heroku

Log into Heroku:
```bash
heroku login
```

Create an app for the sample:
```bash
heroku create
```
> See [Creating Apps from the CLI](https://devcenter.heroku.com/articles/creating-apps) for more details on creating apps.

Configure the app with your AWeber consumer key and secret:
```bash
heroku config:set CONSUMER_KEY=YOUR.AWEBER.CONSUMER.KEY.HERE
heroku config:set CONSUMER_SECRET=YOUR.AWEBER.CONSUMER.SECRET.HERE
```

> The sample stores the consumer key and secret in the `CONSUMER_KEY` and `CONSUMER_SECRET` environment variable, set through Heroku's config vars, rather than in code to help ensure you don't accidentally commit them to a public repository.  See [Configuration and Config Vars](https://devcenter.heroku.com/articles/config-vars) for more details on managing configuration.

> If you plan to run the sample locally using `heroku local`, you will need to set the `CONSUMER_KEY` and `CONSUMER_SECRET` environment variables in the `.env` file.  The sample's `.gitignore` file should exclude `.env` from the repository, but be careful not to commit them to a public repository anyway.  See [Heroku Local](https://devcenter.heroku.com/articles/heroku-local) for more details on running apps locally and the `.env` file.

> If you plan to run the sample locally directly, without Heroku, you will need to set the `PORT`, `CONSUMER_KEY`, and `CONSUMER_SECRET` environment variables directly.  (Heroku sets `PORT` automatically.)

Deploy the app to Heroku:
```bash
git push heroku master
```

Note the URL the app was deployed at.

> The URL will look something like `https://good-luck-173590.herokuapp.com/`.  If the app was deployed correctly, you should see a message like `node-custom-form-cta-type-aweber listening on 52663` when you open the URL in your browser.

### Authorize the sample to access your AWeber account

Authorize the sample to access your AWeber account:

* Open the URL the app was deployed at + `/auth` (e.g. `https://good-luck-173590.herokuapp.com/auth`)
* Enter your AWeber username and password
* Click "Allow Access"

The sample will then store the generated API token and secret in memory and disable the `/auth` endpoint until it's restarted. 

> If you plan to use the sample as the basis for a production application, you should persist the API token and secret.

If you need to restart the sample, use `heroku restart`:

```bash
heroku restart
```

### Configure the sample in Uberflip

[Log into Uberflip](https://app.uberflip.com/) and add the custom form CTA type:

* Click your username at top right and then "Account Settings".
* Click "Custom Integrations".
* Click "Add" next to "Add a new Form CTA integration".
* Enter the following:
  * "Name": The name you want to give the custom form CTA type.
  * "On Submit": The URL the app was deployed at + `/cta-submitted` (e.g. `https://good-luck-173590.herokuapp.com/cta-submitted`)
  * "On Get Fields": The URL the app was deployed at + `/cta-get-fields` (e.g. `https://good-luck-173590.herokuapp.com/cta-get-fields`)
* Click "Save Settings".

### Use the custom form CTA type in Uberflip

Use the new form CTA type as you would any of the built-in form CTA types. When you submit the CTA, you should see a new subscriber added to your AWeber list with the submitted field values.

## Questions and Feedback

If you have questions about [Uberflip](http://www.uberflip.com/) APIs, webhooks, or other platform extension points, please email them to [platform@uberflip.com](mailto:platform@uberflip.com), and we'd be happy to answer them.  We'd also love to hear from you if you're building something interesting on our platform.  

If you have other questions about [Uberflip](http://www.uberflip.com/), or if you're a customer and want to open a support ticket, please contact us through our [normal support channels](http://www.uberflip.com/contact).

## License

Copyright (c) 2016 [Uberflip](http://www.uberflip.com/).

Released under the [MIT License](LICENSE).
