import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';
import { Context as ConfigContext } from '../ConfigContext';

import SignedIn from './Menu/SignedIn';
import SignedOut from './Menu/SignedOut';

function Menu({ currentUser }) {
  const { components } = React.useContext(ConfigContext);

  if (currentUser) {
    return (
      <React.Fragment>
        <components.WelcomeMessageModal />
        <components.AccountUpdatedModal />
        <components.AccountSettingsModal />
        <components.ConfirmPasswordModal />
        <components.ConfirmationModal />

        <SignedIn currentUser={currentUser} />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <components.CompleteRecoveryModal />
      <components.ConfirmationModal />
      <components.RegistrationModal />
      <components.SignInModal />
      <components.StartRecoveryModal />

      <SignedOut />
    </React.Fragment>
  );
}

export default connect(
  createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector
  }),
)(Menu);
