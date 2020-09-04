import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import account from '../../modules/account';
import auth from '../../modules/auth';
import registration from '../../modules/registration'; 

import RegistrationForm from './Form';
import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

const registrationStages = registration.constants.registrationStages;
const modalIsDisplayed = (stage) => stage !== registrationStages.NOT_STARTED;
const isSubmitting = (stage) => stage === registrationStages.SUBMITTING;

const RegistrationModal = ({
  cancelSignUp,
  registrationStage,
  showLoginForm,
  ...props
}) => {
  const formApi = React.useRef(null);

  const submitButton = (
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={formApi.current && formApi.current.isSubmitting}
      submittingText="Signing up..."
      type="submit"
    >
      Sign up
    </StatefulButton>
  );

  return (
    <StandardModal
      buttons={submitButton}
      closeButtonText="Cancel"
      isOpen={modalIsDisplayed(registrationStage)}
      title="Sign up to the Alces Flight Platform"
      toggle={cancelSignUp}
    >
      <RegistrationForm ref={formApi} />
      <hr/>
      <span className="text-muted">
        Already have an account?{' '}
      </span>
      <button
        className="btn btn-link p-0 pb-1"
        onClick={() => {cancelSignUp() ; showLoginForm();}}
        tabIndex={1}
      >
        Sign in
      </button>
    </StandardModal>
  );
};

const enhance = compose(
  connect(
    createStructuredSelector({
      emailFromUrl: registration.selectors.signupEmailFromUrl,
      registrationStage: registration.selectors.registrationState,
    }),
    {
      cancelSignUp: registration.actions.cancelSignUp,
      showLoginForm: auth.actions.showLoginForm,
      startSignUp: registration.actions.startSignUp,
    }
  ),

  lifecycle({
    componentDidMount: function componentDidMount() {
      if (this.props.emailFromUrl) {
        this.props.startSignUp();
      }
    },
  }),
);

export default enhance(RegistrationModal);
