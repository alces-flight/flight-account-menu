# flight-account-menu

> Alces Flight Platform account menu

## Usage

Add the styles to the website

```css
<link rel="stylesheet" href="https://s3-eu-west-1.amazonaws.com/alces-flight/FlightAccountMenu/0.1.0/FlightAccountMenu.css">
```

Add the `<script>` tags

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
<script>
    // These need to be set prior to loading FlightAccountMenu.js
    window.__SSO_BASE_URL__ = 'http://accounts.alces-flight.lvh.me:4000';
    window.__SSO_COOKIE_NAME__ = 'flight_sso_dev';
    window.__FLIGHT_APP_URL__ = 'http://menu.alces-flight.lvh.me:3000';
</script>
<script src="https://s3-eu-west-1.amazonaws.com/alces-flight/FlightAccountMenu/0.1.0/FlightAccountMenu.js"></script>
<script>
    const e = React.createElement;
    ReactDOM.render(
        e(
            FlightAccountMenu.AccountMenu,
            {
                signedInLinks: [
                    {
                        href: "https://center.alces-flight.com",
                        text: "Flight Center",
                    }
                ],
                privacyPolicyUrl: "https://next.alces-flight.com/privacy",
                termsUrl: "https://next.alces-flight.com/terms",
            }, 
            null
        ),
        document.getElementById('flight-account-menu'),
    );
</script>
```

## License

EPL © [Alces Flight Ltd](https://github.com/openflighthpc)
