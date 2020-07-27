import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';

import * as selectors from '../selectors';
import * as actions from '../actions';

const AccountUpdatedModal = ({
  closeModal,
  wasEmailUpdated,
  isOpen,
}) => {
  const message = wasEmailUpdated ?
    (
      <div>
        Please check your email, as we've just sent you a confirmation link.
        You'll need to click that link to confirm the change of email address.
      </div>
    ) :
    <span>Your account has been successfully updated.</span>;
  return (
    <StandardModal
      isOpen={isOpen}
      size="lg"
      title="Account details updated"
      toggle={closeModal}
    >
      {message}
    </StandardModal>
  );
}

AccountUpdatedModal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(
  createStructuredSelector({
    isOpen: selectors.isConfirmationModalShowing,
    wasEmailUpdated: selectors.wasEmailUpdated,
  }),
  {
    closeModal: actions.hideConfirmationModal,
  }
)(AccountUpdatedModal);
