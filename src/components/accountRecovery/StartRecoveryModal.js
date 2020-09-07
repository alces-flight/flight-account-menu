import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import accountRecovery from '../../modules/accountRecovery';

import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

import Form from './RequestTokenForm';
import TokenSentInstructions from './RequestTokenSentInstructions';
import UnexpectedErrorMessage from './UnexpectedErrorMessage';

const StartRecoveryModal = ({
  closeModal,
  isOpen,
  stage,
}) => {
  const formApi = React.useRef(null); 
  const submitButton = (
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={stage === 'SUBMITTING'}
      type="submit"
    >
      Recover
    </StatefulButton>
  );

  return (
    <StandardModal
      buttons={
        stage === 'INITIATED' || stage === 'SUBMITTING' ? submitButton : null
      }
      isOpen={isOpen}
      size="lg"
      title="Recover your Alces Flight Platform account"
      toggle={closeModal}
    >
      { stage === 'RESOLVED' ? <TokenSentInstructions /> : null }
      { stage === 'REJECTED' ? <UnexpectedErrorMessage /> : null }
      { stage === 'INITIATED' || stage === 'SUBMITTING' ? <Form ref={formApi} /> : null }
    </StandardModal>
  );
}

export const enhance = compose(
  connect(
    createStructuredSelector({
      isOpen: accountRecovery.selectors.requestToken.isModalOpen,
      stage: accountRecovery.selectors.requestToken.stage,
    }),
    {
      closeModal: accountRecovery.actions.hideRequestTokenModal,
    }
  ),
);

export default enhance(StartRecoveryModal);
