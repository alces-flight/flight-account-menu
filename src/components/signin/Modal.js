import React from 'react'
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import accountRecovery from '../../modules/accountRecovery';
import auth from '../../modules/auth';
import registration from '../../modules/registration';

import SignInForm from './Form';
import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

import styles from '../../styles.module.css';

const modalIsDisplayed = (stage) => stage !== auth.constants.signOnStates.NOT_STARTED;

function SignInModal({
  hideLoginForm,
  signOnState,
  startAccountRecovery,
  startSignUp,
}) {
  const formApi = React.useRef(null); 
  const submitButton = (
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={signOnState === auth.constants.signOnStates.SUBMITTING}
      type="submit"
    >
      Sign in
    </StatefulButton>
  );

  return (
    <StandardModal
      buttons={submitButton}
      closeButtonText="Cancel"
      isOpen={modalIsDisplayed(signOnState)}
      title="Sign in to Flight"
      toggle={hideLoginForm}
    >
      <SignInForm ref={formApi} />
      <hr/>
      <span className="text-muted">
        Don&rsquo;t have an account yet?{' '}
      </span>
      <button
        className={classNames("btn btn-link", styles.inlineButton)}
        onClick={() => {hideLoginForm() ; startSignUp();}}
        tabIndex={1}
      >
        Sign up
      </button>
      <br />
      <span className="text-muted">
        Forgot your password?{' '}
        <button
          className={classNames("btn btn-link", styles.inlineButton)}
          onClick={() => {hideLoginForm(); startAccountRecovery();}}
          tabIndex={1}
        >
          Start recovering your account
        </button>
      </span>

    </StandardModal>
  );
}

export default connect(
  createStructuredSelector({
    signOnState: auth.selectors.signOnStateSelector
  }),
  {
    hideLoginForm: auth.actions.hideLoginForm,
    startSignUp: registration.actions.startSignUp,
    startAccountRecovery: accountRecovery.actions.startAccountRecovery,
  }
)(SignInModal);
