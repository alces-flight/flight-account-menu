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
    return <SignedIn currentUser={currentUser} />;
  }
  return <SignedOut />;
}

export default connect(
  createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector
  }),
)(Menu);
