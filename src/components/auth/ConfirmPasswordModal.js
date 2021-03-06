import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../../modules/auth';

import ConfirmPasswordForm from './ConfirmPasswordForm';
import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

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

const ConfirmPasswordModal = ({
  isOpen,
  reason,
  retrieval,
  toggle,
}) => {
  const formApi = React.useRef(null); 
  const submitButton = (
    <StatefulButton
      className="btn btn-primary"
      submittingText="Signing in..."
      onClick={() => formApi.current.submit() }
      submitting={retrieval.pending}
    >
      Submit
    </StatefulButton>
  );

  return (
    <StandardModal
      buttons={submitButton}
      closeButtonText="Cancel"
      isOpen={isOpen}
      size="lg"
      title={reason === 'matured' ? 'Confirm your password' : 'Session about to expire'}
      toggle={toggle}
    >
      <Explanation reason={reason} />
      <ConfirmPasswordForm ref={formApi} />
    </StandardModal>
  );
};

export const enhance = connect(
  createStructuredSelector({
    isOpen: auth.selectors.confirmPassword.isModalOpen,
    retrieval: auth.selectors.confirmPassword.retrieval,
    reason: (state) => {
      const aboutToExpire = auth.selectors.ssoTokenAboutToExpire(state);
      const isMatured = auth.selectors.ssoTokenMatured(state);
      if (aboutToExpire) { return 'aboutToExpire'; }
      if (isMatured) { return 'matured'; }
      return 'unknown';
    },
  }),
  {
    toggle: () => auth.actions.hideConfirmPasswordForm({ manuallyDismissed: true }),
  }
);

export default enhance(ConfirmPasswordModal);
