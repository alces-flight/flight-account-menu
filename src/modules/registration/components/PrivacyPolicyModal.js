import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';
import PrivacyPolicy from '../../../organisms/meta-pages/Privacy';

import * as selectors from '../selectors';
import * as actions from '../actions';

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

PrivacyPolicyModal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(
  createStructuredSelector({
    isOpen: selectors.isPrivacyPolicyModalShowing,
  }),
  {
    closeModal: actions.hidePrivacyPolicyModal,
  }
)(PrivacyPolicyModal);
