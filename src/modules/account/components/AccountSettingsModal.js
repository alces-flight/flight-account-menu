import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';
import SubmitButton from '../../../components/ReduxFormSubmitButton';

import * as selectors from '../selectors';
import * as actions from '../actions';
import Form from './AccountSettingsForm';

const AccountSettingsModal = ({
  closeModal,
  isOpen,
}) => (
  <StandardModal
    buttons={(
      <SubmitButton
        color="success"
        form="accountSettings"
      >
        Update
      </SubmitButton>
    )}
    isOpen={isOpen}
    size="lg"
    title="Update your account details"
    toggle={closeModal}
  >
    <Form />
  </StandardModal>
);

AccountSettingsModal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(
  createStructuredSelector({
    isOpen: selectors.isSettingsModalShowing,
  }),
  {
    closeModal: actions.hideSettingsModal,
  }
)(AccountSettingsModal);
