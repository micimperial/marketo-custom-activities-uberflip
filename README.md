# Marketo Custom Activities For Uberflip 
Middleware to enable [Marketo's custom activities](http://docs.marketo.com/display/public/DOCS/Understanding+Custom+Activities) with [Uberflip's Custom Form CTA types](https://platform.uberflip.com/form_cta_types/intro/overview.html)


## Before you Begin
You'll need to have the following information readily available

Variable | Details
- | -
CLIENTID | Read this article to learn how to find your Client ID: https://learn.uberflip.com/marketo/setting-up-your-marketo-integration
CLIENTSECRET | Read this article to learn how to find your Client Secret: https://learn.uberflip.com/marketo/setting-up-your-marketo-integration
CLIENTSUBDOMAIN | Read this article to learn how to find your Client Subdomain: https://learn.uberflip.com/marketo/setting-up-your-marketo-integration
LISTID | Read this article to learn how to find your List ID: http://tosbourn.com/marketo-api-list-id/
CUSTOMACTIVITYID | This can be found in your Marketo backend under: <div>Admin > Database Management > Marketo Custom Activities</div>

## Uberflip Integration Settings
### Custom Form CTA Types

#### On Submit
`https://uf-marketo-custom-activies.herokuapp.com/submit?vars=CLIENTID|CLIENTSECRET|CLIENTSUBDOMAIN|LISTID|CUSTOMACTIVITYID`

#### Get Fields
`https://uf-marketo-custom-activies.herokuapp.com/get-fields?vars=CLIENTID|CLIENTSECRET|CLIENTSUBDOMAIN|LISTID|CUSTOMACTIVITYID`