import React from 'react';
import { Button } from 'reactstrap';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import UnexpectedErrorMessage from './UnexpectedErrorMessage';

import styles from '../../styles.module.css';

const ResetPasswordError = ({ errors, startAccountRecovery }) => {
  if (errors == null) {
    return <UnexpectedErrorMessage />;
  }
  let errorMessage;
  if (errors[0] === 'is invalid') {
    errorMessage = (
      <p>
        The password reset token has not been recognized.  Please make sure that
        it has been entered into the browser's address bar correctly, or{' '}
        <Button
          className={styles.inlineButton}
          color="link"
          onClick={startAccountRecovery}
        >
          request a new password reset token
        </Button>.
      </p>
    );
  } else if (errors[0].match(/^has expired\b/)) {
    errorMessage = (
      <p>
        The password reset token has expired.  Please request a new token.
      </p>
    );
  } else {
    errorMessage = <UnexpectedErrorMessage />;
  }

  return (
    <div>
      {errorMessage}
    </div>
  );
};

const enhance = compose(
  connect(
    null,
    (dispatch) => ({
      startAccountRecovery: () => {
        dispatch(accountRecovery.actions.hideResetPasswordModal());
        dispatch(accountRecovery.actions.startAccountRecovery());
      },
    }),
  ),
);

export default enhance(ResetPasswordError);
