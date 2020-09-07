import React from 'react';
import classNames from 'classnames';
import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import account from '../../modules/account';
import auth from '../../modules/auth';
import registration from '../../modules/registration'; 

import RegistrationForm from './Form';
import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

import styles from '../../styles.module.css';

const RegistrationModal = ({
  cancelSignUp,
  isOpen,
  isSubmitting,
  showLoginForm,
}) => {
  const formApi = React.useRef(null);

  const submitButton = (
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={isSubmitting}
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
      isOpen={isOpen}
      title="Sign up to the Alces Flight Platform"
      toggle={cancelSignUp}
    >
      <RegistrationForm ref={formApi} />
      <hr/>
      <span className="text-muted">
        Already have an account?{' '}
      </span>
      <button
        className={classNames("btn btn-link", styles.inlineButton)}
        onClick={() => {cancelSignUp() ; showLoginForm();}}
        tabIndex={1}
      >
        Sign in
      </button>
    </StandardModal>
  );
};

export const enhance = compose(
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

  withProps((props) => {
    const stages = registration.constants.registrationStages;
    return {
      isOpen: props.registrationStage !== stages.NOT_STARTED,
      isSubmitting: props.registrationStage === stages.SUBMITTING,
    }
  }),
);

export default enhance(RegistrationModal);
