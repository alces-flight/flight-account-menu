import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';

import SignedIn from './Menu/SignedIn';
import SignedOut from './Menu/SignedOut';
import SignInModal from './signin/Modal';
import RegistrationModal from './registration/Modal';
import TermsModal from './registration/TermsModal';
import PrivacyPolicyModal from './registration/PrivacyPolicyModal';

function Menu({ currentUser, signedInLinks }) {
  if (currentUser) {
    return (
      <SignedIn
        currentUser={currentUser}
        signedInLinks={signedInLinks}
      />
    );
  }
  return (
    <React.Fragment>
      <RegistrationModal />
      <TermsModal />
      <PrivacyPolicyModal />
      <SignInModal />

      <SignedOut />
    </React.Fragment>
  );
}

export default connect(
  createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector
  }),
)(Menu);
