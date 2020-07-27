import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';
import Terms from '../../../organisms/meta-pages/Terms';

import * as selectors from '../selectors';
import * as actions from '../actions';

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

TermsModal.propTypes = {
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(
  createStructuredSelector({
    isOpen: selectors.isTermsModalShowing,
  }),
  {
    closeModal: actions.hideTermsModal,
  }
)(TermsModal);
