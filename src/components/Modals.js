import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';
import { Context as ConfigContext } from '../ConfigContext';

function Modals({ currentUser }) {
  const { components } = React.useContext(ConfigContext);

  if (currentUser) {
    return (
      <React.Fragment>
        <components.WelcomeMessageModal />
        <components.AccountUpdatedModal />
        <components.AccountSettingsModal />
        <components.ConfirmPasswordModal />
        <components.ConfirmationModal />
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
    </React.Fragment>
  );
}

export default connect(
  createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector
  }),
)(Modals);
