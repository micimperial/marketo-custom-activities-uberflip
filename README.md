# Marketo Custom Activities For Uberflip 
Middleware to enable [Marketo's custom activities](http://docs.marketo.com/display/public/DOCS/Understanding+Custom+Activities) with [Uberflip's Custom Form CTA types](https://platform.uberflip.com/form_cta_types/intro/overview.html)


## Before you Begin
You'll need to have the following information readily available

Variable | Details
---- | ----
CLIENTID | Read this article to learn how to find your Client ID: <div>https://learn.uberflip.com/marketo/setting-up-your-marketo-integration</div>
CLIENTSECRET | Read this article to learn how to find your Client Secret: <div>https://learn.uberflip.com/marketo/setting-up-your-marketo-integration</div>
CLIENTSUBDOMAIN | <div>You will only need to use the subdomain part of your REST API endpoint URL (e.g.: ~~https://~~ **123-ABC-456** ~~.mktorest.com/rest~~) </div><div>&nbsp;</div>Read this article to learn how to find your Client Subdomain: <div>https://learn.uberflip.com/marketo/setting-up-your-marketo-integration</div>
LISTID | Read this article to learn how to find your List ID: <div>http://tosbourn.com/marketo-api-list-id/</div>
CUSTOMACTIVITYID | This can be found in your Marketo backend under: <div>Admin > Database Management > Marketo Custom Activities</div>

## Uberflip Integration Settings
### Custom Form CTA Types

#### On Submit
`https://uf-marketo-custom-activies.herokuapp.com/submit?vars=CLIENTID|CLIENTSECRET|CLIENTSUBDOMAIN|LISTID|CUSTOMACTIVITYID`

#### Get Fields
`https://uf-marketo-custom-activies.herokuapp.com/get-fields?vars=CLIENTID|CLIENTSECRET|CLIENTSUBDOMAIN|LISTID|CUSTOMACTIVITYID`