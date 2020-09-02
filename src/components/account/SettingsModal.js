import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import account from '../../modules/account';
import auth from '../../modules/auth';

import useForm from '../../useForm';

import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';

const SettingsModal = ({
  closeModal,
  dispatch,
  isOpen,
  submission,
  updateAccount,
}) => {
  const { handleSubmit, handleInputChange, inputs, errors, touched } = useForm(updateAccount);

  return (
    <StandardModal
      buttons={(
        <StatefulButton
          className="btn btn-primary"
          submitting={submission.pending}
          onClick={handleSubmit}
          style={{ minWidth: '52px' }}
          type="submit"
        >
          Update
        </StatefulButton>
      )}
      isOpen={isOpen}
      size="lg"
      title="Update your account details"
      toggle={closeModal}
    >
      Form
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        inputs={inputs}
        errors={errors}
        touched={touched}

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
    updateAccount: account.actions.update,
  }
)(SettingsModal);

