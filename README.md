# Marketo Custom Activities For Uberflip 
Middleware to enable [Marketo's custom activities](http://docs.marketo.com/display/public/DOCS/Understanding+Custom+Activities) with [Uberflip's Custom Form CTA types](https://platform.uberflip.com/form_cta_types/intro/overview.html)

## Creating The Middleware App
### Sign up for a Heroku account

[Sign up for a Heroku account.](https://signup.heroku.com/)

> Heroku is a cloud Platform-as-a-Service (PaaS) popular with the open-source community. Heroku has a [free plan](https://www.heroku.com/pricing) that you can sign up for without a credit card and use to host small apps (limited to a single virtual server per app, running 18 hours/day, and sleeping after 30 minutes of inactivity).   

### Get the sample

Clone the sample from git:

```bash
git clone https://github.com/micimperial/marketo-custom-activities-uberflip
cd node-custom-form-cta-type-aweber/
```

Install the dependencies:
```bash
npm install
```

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


Deploy the app to Heroku:
```bash
git push heroku master
```

If you need to restart the sample, use `heroku restart`:

```bash
heroku restart
```

## Uberflip Integration 

### Before you Begin
You'll need to have the following information readily available from your Marketo account.

Variable | Details
---- | ----
`CLIENTID` | Read this article to learn how to find your Client ID: <div>https://learn.uberflip.com/marketo/setting-up-your-marketo-integration</div>
`CLIENTSECRET` | Read this article to learn how to find your Client Secret: <div>https://learn.uberflip.com/marketo/setting-up-your-marketo-integration</div>
`CLIENTSUBDOMAIN` | <div>You will only need to use the subdomain part of your REST API endpoint URL (e.g.: ~~https://~~ **123-ABC-456** ~~.mktorest.com/rest~~) </div><div>&nbsp;</div>Read this article to learn how to find your Client Subdomain: <div>https://learn.uberflip.com/marketo/setting-up-your-marketo-integration</div>
`LISTID` | Read this article to learn how to find your List ID: <div>http://tosbourn.com/marketo-api-list-id/</div>
`CUSTOMACTIVITYID` | This can be found in your Marketo backend under: <div>Admin > Database Management > Marketo Custom Activities</div>

### Setting Up A Custom Form CTA Type
1. Go to [Account Settings](https://app.uberflip.com/account/details) in the Uberflip backend
1. Select **Custom Integrations** in the side menu under **Integration**
1. **Add a new Form CTA integration** and enter the details below, replacing the `UPPERCASE` words with your info:

 *  **Name:**  <div>Enter a name that describes your list and custom activity</div>
 *  **On Submit:**  <div>`https://uf-marketo-custom-activies.herokuapp.com/submit?vars=CLIENTID|CLIENTSECRET|CLIENTSUBDOMAIN|LISTID|CUSTOMACTIVITYID`</div>
 *  **On Get Fields:**  <div>`https://uf-marketo-custom-activies.herokuapp.com/get-fields?vars=CLIENTID|CLIENTSECRET|CLIENTSUBDOMAIN|LISTID|CUSTOMACTIVITYID`</div>

1. **Save settings**

### Creating a Custom Form CTA
1. Open your Hub dashboard.
1. Select "Calls-To-Action" from the side menu.
1. Under **Form CTAs** Press the **+** to add a new Form CTA
1. Within the modal pop-up, name your Form CTA and select your newly created Custom Integration from the Integration dropdown menu
1. Within the **Edit CTA** screen advanced through the steps to customize your CTA

###Custom Activity Primary Field
If you would like to set the value to your Custom Activity's Primary Field upon CTA submission, add a Hidden Form Field to your CTA named **primaryAttributeValue** with the value of your choosing.

## License

Copyright (c) 2016 [Uberflip](http://www.uberflip.com/).

Released under the [MIT License](LICENSE).