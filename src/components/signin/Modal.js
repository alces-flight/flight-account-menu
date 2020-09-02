import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../../modules/auth';
import registration from '../../modules/registration';

import SignInForm from './Form';
import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

const modalIsDisplayed = (stage) => stage !== auth.constants.signOnStates.NOT_STARTED;

function SignInModal({
  hideLoginForm,
  signOnState,
  startSignUp,
}) {
  const formApi = React.useRef(null); 
  const submitButton =(
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={formApi.isSubmitting}
      style={{ minWidth: '52px' }}
      type="submit"
    >
      Sign in
    </StatefulButton>
  )

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
        className="btn btn-link p-0 pb-1"
        onClick={() => {hideLoginForm() ; startSignUp();}}
        tabIndex={1}
      >
        Sign up
      </button>

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
  }
)(SignInModal);
