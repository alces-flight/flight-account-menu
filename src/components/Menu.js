import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';

import AccountSettingsModal from './account/SettingsModal';
import PrivacyPolicyModal from './registration/PrivacyPolicyModal';
import RegistrationModal from './registration/Modal';
import SignInModal from './signin/Modal';
import SignedIn from './Menu/SignedIn';
import SignedOut from './Menu/SignedOut';
import TermsModal from './registration/TermsModal';
import WelcomeMessageModal from './registration/WelcomeMessageModal';

function Menu({ currentUser, signedInLinks }) {
  if (currentUser) {
    return (
      <React.Fragment>
        <WelcomeMessageModal />
        <AccountSettingsModal />

        <SignedIn
          currentUser={currentUser}
          signedInLinks={signedInLinks}
        />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <PrivacyPolicyModal />
      <RegistrationModal />
      <SignInModal />
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
