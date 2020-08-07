import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import registration from '../../modules/registration'; 

import StandardModal from '../StandardModal';

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

const enhance = compose(
  connect(
    createStructuredSelector({
      isOpen: registration.selectors.isWelcomeMessageModalShowing,
    }),
    {
      closeModal: registration.actions.hideWelcomeMessageModal,
    }
  ),
);

export default enhance(WelcomeMessageModal);
