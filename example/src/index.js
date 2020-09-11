import React from 'react'
import ReactDOM from 'react-dom'

import { AccountMenu, ModalContainer, addOnAuthChangeCallback, showLoginForm } from 'flight-account-menu';
import 'flight-account-menu/dist/index.css';

const Menu = () => {
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

const Modals = () => {
  return (
    <ModalContainer
      privacyPolicyUrl="https://next.alces-flight.com/privacy"
      termsUrl="https://next.alces-flight.com/terms"
    />
  );
}

ReactDOM.render(<Menu />, document.getElementById('flight-account-menu'));
ReactDOM.render(<Menu />, document.getElementById('flight-account-menu-sm'));
ReactDOM.render(<Modals />, document.getElementById('flight-account-modal-container'));


// Add a callback function that we want to run whenever the authentication
// changes.
addOnAuthChangeCallback(function(currentUser) {
  console.log('currentUser is', currentUser);
});


document.getElementById('sign-in-link').addEventListener('click', showLoginForm);
