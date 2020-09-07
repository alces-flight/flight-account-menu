import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';

import AccountSettingsModal from './account/SettingsModal';
import AccountUpdatedModal from './account/UpdatedModal';
import CompleteRecoveryModal from './accountRecovery/ResetPasswordModal';
import ConfirmationModal from './confirmation/Modal';
import ConfirmPasswordModal from './auth/ConfirmPasswordModal';
import RegistrationModal from './registration/Modal';
import SignInModal from './signin/Modal';
import SignedIn from './Menu/SignedIn';
import SignedOut from './Menu/SignedOut';
import StartRecoveryModal from './accountRecovery/RequestTokenModal';
import WelcomeMessageModal from './registration/WelcomeMessageModal';

function Menu({ currentUser }) {
  if (currentUser) {
    return (
      <React.Fragment>
        <WelcomeMessageModal />
        <AccountUpdatedModal />
        <AccountSettingsModal />
        <ConfirmPasswordModal />

        <SignedIn currentUser={currentUser} />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <CompleteRecoveryModal />
      <ConfirmationModal />
      <RegistrationModal />
      <SignInModal />
      <StartRecoveryModal />

      <SignedOut />
    </React.Fragment>
  );
}

export default connect(
  createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector
  }),
)(Menu);
