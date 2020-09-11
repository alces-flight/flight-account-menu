import React from 'react'
import ReactDOM from 'react-dom'

import { AccountMenu, ModalContainer, store, auth } from 'flight-account-menu';
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

// Create a function that we want to run whenever the authentication changes.
function logCurrentUser(currentUser) {
  console.log('currentUser is', currentUser);
}

// Wrap the function in a guard so non-auth-changes are ignored.
const guardedLogCurrentUser = auth.logic.whenAuthChanges(
  logCurrentUser,
  { includeInitial: false },
);

// Subscribe the guarded function to every change to the redux store.
store.subscribe(() => {
  guardedLogCurrentUser(store.dispatch, store.getState);
});
