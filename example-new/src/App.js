import React from 'react'

import { AccountMenu } from 'flight-account-menu';
import 'flight-account-menu/dist/index.css';

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
    />
  );
}

export default App
