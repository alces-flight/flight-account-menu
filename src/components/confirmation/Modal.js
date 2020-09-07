import React from 'react';
import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import confirmation from '../../modules/confirmation';

import StandardModal from '../StandardModal';

const { confirmationStages } = confirmation.constants;
const closeButtonShowing = (stage) => (
  stage === confirmationStages.SUCCEEDED || stage === confirmationStages.FAILED
);

const ConfirmationError = ({ error }) => {
  let friendlyError;

  if (error['confirmation_token'] && error['confirmation_token'][0] === 'is invalid') {
    friendlyError = (
      <React.Fragment>
        The confirmation token was not valid. Please check the email we sent
        you and try again.
      </React.Fragment>
    );
  }
  else if (error['email'] && error['email'][0] === 'was already confirmed, please try signing in') {
    friendlyError = (
      <React.Fragment>
        Your Alces Flight Platform account is already confirmed. Please try
        signing in.
      </React.Fragment>
    );
  }
  else {
    friendlyError = (
      <React.Fragment>
        An error occurred when trying to validate your account. Please check
        the email we sent you and try again.
      </React.Fragment>
    );
  }

  return (
    <p className='text-warning'>{friendlyError}</p>
  );
};

const Success = ({ confirmedEmailChange }) => (
  confirmedEmailChange ?
  (
    <p>
      Thanks for confirming your email address.
    </p>
  ) :
  (
    <p>
      Thanks for confirming your email address. You are now signed in to your
      Alces Flight Platform account.
    </p>
  )
);

function ConfirmationModal({
  closeDialog,
  confirmationState: { stage, error, confirmedEmailChange },
  isOpen,
}) {

  return (
    <StandardModal
      isOpen={isOpen}
      title="Confirming your Alces Flight Platform account"
      toggle={closeDialog}
    >
      { stage === confirmationStages.SUBMITTED ? <p>Please wait...</p> : null }
      { stage === confirmationStages.SUCCEEDED ?
          <Success confirmedEmailChange={confirmedEmailChange} /> :
          null
      }
      { stage === confirmationStages.FAILED ? <ConfirmationError error={error} /> : null }
    </StandardModal>
  );
}

export const enhance = compose(
  connect(
    createStructuredSelector({
      confirmationState: confirmation.selectors.confirmationState,
      token: confirmation.selectors.tokenFromUrl,
    }),
    {
      submitConfirmation: confirmation.actions.submitConfirmation,
      closeDialog: confirmation.actions.closeDialog,
    }
  ),

  lifecycle({
    componentDidMount: function componentDidMount() {
      const { confirmationState: { stage }, submitConfirmation, token } = this.props;
      if (token && stage === confirmationStages.NOT_STARTED) {
        submitConfirmation(token);
      }
    }
  }),

  withProps((props) => {
    return {
      isOpen: props.confirmationState.stage !== confirmationStages.NOT_STARTED,
    }
  }),
);

export default enhance(ConfirmationModal);
