import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import registration from '../../modules/registration'; 

import StandardModal from '../StandardModal';
import Terms from './Terms';

const TermsModal = ({
  closeModal,
  isOpen,
}) => (
  <StandardModal
    isOpen={isOpen}
    size="lg"
    title={Terms.title}
    toggle={closeModal}
  >
    <Terms />
  </StandardModal>
);

export default connect(
  createStructuredSelector({
    isOpen: registration.selectors.isTermsModalShowing,
  }),
  {
    closeModal: registration.actions.hideTermsModal,
  }
)(TermsModal);
