import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';

import * as actions from '../actions';
import * as selectors from "../selectors";

const WelcomeMessageModal = ({
  closeModal,
  isOpen,
}) => (
  <StandardModal
    isOpen={isOpen}
    size="lg"
    title="Thanks for registering!"
    toggle={closeModal}
  >
    <p>
      Please check your email, as we've just sent you a confirmation link.
      You'll need to click that link to complete the registration for your
      Alces Flight Platform account.
    </p>
    <p>
      Until you've clicked that link, your access to the Alces Flight Platform
      is limited.
    </p>
  </StandardModal>
);

WelcomeMessageModal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
};

const enhance = compose(
  connect(
    createStructuredSelector({
      isOpen: selectors.isWelcomeMessageModalShowing,
    }),
    {
      closeModal: actions.hideWelcomeMessageModal,
    }
  ),
);

export default enhance(WelcomeMessageModal);
