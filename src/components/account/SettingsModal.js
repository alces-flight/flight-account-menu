import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import account from '../../modules/account';
import auth from '../../modules/auth';

import useForm from '../../useForm';

import Form from './SettingsForm';
import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

const SettingsModal = ({
  closeModal,
  dispatch,
  isOpen,
  submission,
  updateAccount,
}) => {
  const formApi = React.useRef(null); 
  const submitButton =(
    <StatefulButton
      className="btn btn-primary"
      onClick={() => formApi.current.submit() }
      submitting={formApi.isSubmitting}
      type="submit"
    >
      Update
    </StatefulButton>
  )

  return (
    <StandardModal
      buttons={submitButton}
      isOpen={isOpen}
      size="lg"
      title="Update your account details"
      toggle={closeModal}
    >
      <Form ref={formApi} />
    </StandardModal>
  );
}

export default connect(
  createStructuredSelector({
    isOpen: account.selectors.isSettingsModalShowing,
    submission: account.selectors.retrieval,
  }),
  {
    closeModal: account.actions.hideSettingsModal,
  }
)(SettingsModal);
