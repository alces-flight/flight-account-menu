import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';
import SubmitButton from '../../../components/ReduxFormSubmitButton';

import * as actions from '../actions';
import * as selectors from "../selectors";
import ConfirmPasswordForm from './ConfirmPasswordForm';

const Explanation = ({ reason }) => {
  switch (reason) {
    case 'aboutToExpire':
      return (
        <p>
          Your session is about to expire.  Please enter your password to renew
          your session.
        </p>
      );

    case 'matured':
      return (
        <p>
          To continue using this service we need you to confirm your password.
        </p>
      );

    default:
      return null;
  }
};

Explanation.propTypes = {
  reason: PropTypes.oneOf(['aboutToExpire', 'matured', 'unknown']).isRequired,
};

const ConfirmPasswordModal = ({
  isOpen,
  reason,
  toggle,
}) => {
  return (
    <StandardModal
      buttons={(
        <SubmitButton
          color="success"
          form="confirmPassword"
          submittingText="Signing in..."
        >
          Submit
        </SubmitButton>
      )}
      closeButtonText="Cancel"
      isOpen={isOpen}
      size="lg"
      title={reason === 'matured' ? 'Confirm your password' : 'Session about to expire'}
      toggle={toggle}
    >
      <Explanation reason={reason} />
      <ConfirmPasswordForm />
    </StandardModal>
  );
};

ConfirmPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  reason: PropTypes.oneOf(['aboutToExpire', 'matured', 'unknown']).isRequired,
  toggle: PropTypes.func.isRequired,
};

export default connect(
  createStructuredSelector({
    isOpen: selectors.confirmPassword.isModalOpen,
    reason: (state) => {
      const aboutToExpire = selectors.ssoTokenAboutToExpire(state);
      const isMatured = selectors.ssoTokenMatured(state);
      if (aboutToExpire) { return 'aboutToExpire'; }
      if (isMatured) { return 'matured'; }
      return 'unknown';
    },
  }),
  {
    toggle: () => actions.hideConfirmPasswordForm({ manuallyDismissed: true }),
  }
)(ConfirmPasswordModal);
