import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import accountRecovery from '../../modules/accountRecovery';

const RequestTokenSentInstructions = ({ email }) => {
  return (
    <p>
      An email containing a link to continue the recovery process has been
      sent to <code>{email}</code>. Once you've received the email please
      click the link it contains, you will then be able to choose your
      new password and complete the recovery of your account.
    </p>
  );
}

const enhance = compose(
  connect(createStructuredSelector({
    email: accountRecovery.selectors.requestToken.email,
  })),
);

export default enhance(RequestTokenSentInstructions);
