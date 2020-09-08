import React from 'react'
import ReactDOM from 'react-dom'
import { AccountMenu } from 'flight-account-menu';

const App = () => {
  return (
    <AccountMenu 
      signedInLinks={[
        {
          href: "https://center.alces-flight.com",
          text: "Flight Center",
        }
      ]}
      privacyPolicyUrl="https://next.alces-flight.com/privacy"
      termsUrl="https://next.alces-flight.com/terms"
      components={{
      }}
    />
  );
}

ReactDOM.render(<App />, document.getElementById('flight-account-menu'))
