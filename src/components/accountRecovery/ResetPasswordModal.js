import React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import accountRecovery from '../../modules/accountRecovery';

import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

import Form from './ResetPasswordForm';
import ResetCompleteInstructions from './ResetCompleteInstructions';
import ResetPasswordError from './ResetPasswordError';

const ResetPasswordModal = ({
  closeModal,
  isOpen,
  stage,
  token,
}) => {
  const formApi = React.useRef(null); 
  const submitButton = (
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={stage === 'SUBMITTING'}
      style={{ minWidth: '52px' }}
      type="submit"
    >
      Recover
    </StatefulButton>
  );

  return (
    <StandardModal
      buttons={
        stage === 'INITIATED' || stage === 'SUBMITTING' ?  submitButton : null
      }
      isOpen={isOpen}
      size="lg"
      title="Complete your account recovery"
      toggle={closeModal}
    >
      { stage === 'RESOLVED' ? <ResetCompleteInstructions /> : null }
      { stage === 'REJECTED' ? <ResetPasswordError /> : null }
      { stage === 'INITIATED' || stage === 'SUBMITTING' ? <Form token={token} ref={formApi} /> : null }
    </StandardModal>
  );
}

const enhance = compose(

  connect(
    createStructuredSelector({
      isOpen: accountRecovery.selectors.resetPassword.isModalOpen,
      stage: accountRecovery.selectors.resetPassword.stage,
      token: accountRecovery.selectors.tokenFromUrl,
    }),
    {
      closeModal: accountRecovery.actions.hideResetPasswordModal,
      showModal: accountRecovery.actions.showResetPasswordModal,
    }
  ),

  lifecycle({
    componentDidMount: function componentDidMount() {
      if (this.props.token) {
        this.props.showModal();
      }
    },
  }),
);

export default enhance(ResetPasswordModal);
