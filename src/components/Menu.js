import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../modules/auth';
import SignedIn from './Menu/SignedIn';
import SignedOut from './Menu/SignedOut';
import SignInModal from './signin/Modal';

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
