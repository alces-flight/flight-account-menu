import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import registration from '../../modules/registration'; 

import StandardModal from '../StandardModal';
import PrivacyPolicy from './PrivacyPolicy';

const PrivacyPolicyModal = ({
  closeModal,
  isOpen,
}) => (
  <StandardModal
    isOpen={isOpen}
    size="lg"
    title={PrivacyPolicy.title}
    toggle={closeModal}
  >
    <PrivacyPolicy />
  </StandardModal>
);

export default connect(
  createStructuredSelector({
    isOpen: registration.selectors.isPrivacyPolicyModalShowing,
  }),
  {
    closeModal: registration.actions.hidePrivacyPolicyModal,
  }
)(PrivacyPolicyModal);
