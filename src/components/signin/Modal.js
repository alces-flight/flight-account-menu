import React from 'react'
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, withProps } from 'recompose';

import accountRecovery from '../../modules/accountRecovery';
import auth from '../../modules/auth';
import registration from '../../modules/registration';
import { Context as ConfigContext } from '../../ConfigContext';

import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

import styles from '../../styles.module.css';

function SignInModal({
  hideLoginForm,
  isOpen,
  isSubmitting,
  startAccountRecovery,
  startSignUp,
}) {
  const formApi = React.useRef(null); 
  const SignInForm = React.useContext(ConfigContext).components.SignInForm;
  const submitButton = (
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={isSubmitting}
      type="submit"
    >
      Sign in
    </StatefulButton>
  );

  return (
    <StandardModal
      buttons={submitButton}
      closeButtonText="Cancel"
      isOpen={isOpen}
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

export const enhance = compose(
  connect(
    createStructuredSelector({
      signOnState: auth.selectors.signOnStateSelector
    }),
    {
      hideLoginForm: auth.actions.hideLoginForm,
      startSignUp: registration.actions.startSignUp,
      startAccountRecovery: accountRecovery.actions.startAccountRecovery,
    }
  ),

  withProps((props) => {
    return {
      isOpen: props.signOnState !== auth.constants.signOnStates.NOT_STARTED,
      isSubmitting: props.signOnState === auth.constants.signOnStates.SUBMITTING,
    }
  }),

);

export default enhance(SignInModal);
