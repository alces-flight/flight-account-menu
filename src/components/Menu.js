import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';

import AccountSettingsModal from './account/SettingsModal';
import AccountUpdatedModal from './account/UpdatedModal';
import CompleteRecoveryModal from './accountRecovery/ResetPasswordModal';
import ConfirmationModal from './confirmation/Modal';
import ConfirmPasswordModal from './auth/ConfirmPasswordModal';
import PrivacyPolicyModal from './registration/PrivacyPolicyModal';
import RegistrationModal from './registration/Modal';
import SignInModal from './signin/Modal';
import SignedIn from './Menu/SignedIn';
import SignedOut from './Menu/SignedOut';
import StartRecoveryModal from './accountRecovery/RequestTokenModal';
import TermsModal from './registration/TermsModal';
import WelcomeMessageModal from './registration/WelcomeMessageModal';

function Menu({ currentUser, signedInLinks }) {
  if (currentUser) {
    return (
      <React.Fragment>
        <WelcomeMessageModal />
        <AccountUpdatedModal />
        <AccountSettingsModal />
        <ConfirmPasswordModal />

        <SignedIn
          currentUser={currentUser}
          signedInLinks={signedInLinks}
        />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <CompleteRecoveryModal />
      <ConfirmationModal />
      <PrivacyPolicyModal />
      <RegistrationModal />
      <SignInModal />
      <StartRecoveryModal />
      <TermsModal />

      <SignedOut />
    </React.Fragment>
  );
}

export default connect(
  createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector
  }),
)(Menu);
