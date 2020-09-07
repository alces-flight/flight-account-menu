import React from 'react';
import { Button } from 'reactstrap';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import accountRecovery from '../../modules/accountRecovery';
import auth from '../../modules/auth';

import styles from '../../styles.module.css';

const ResetCompleteInstructions = ({ showLoginForm }) => (
  <div>
    <p>
      Your password has been successfully reset. You may now{' '}
      <Button
        color="link"
        className={styles.inlineButton}
        onClick={showLoginForm}
      >
        sign in
      </Button>.
    </p>
  </div>
);

const enhance = compose(
  connect(
    null,
    (dispatch) => ({
      showLoginForm: () => {
        dispatch(accountRecovery.actions.hideCompleteRecoveryModal());
        dispatch(auth.actions.showLoginForm());
      },
    }),
  ),

);

export default enhance(ResetCompleteInstructions);
