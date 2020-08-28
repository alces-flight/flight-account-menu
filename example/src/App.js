import React from 'react'

import { AccountMenu } from 'flight-account-menu'
import 'flight-account-menu/dist/index.modern.css'

const App = () => {
  return (
    <AccountMenu 
      signedInLinks={[
        {
          href: "https://center.alces-flight.com",
          text: "Flight Center",
        }
      ]}
    />
  );
}

export default App
