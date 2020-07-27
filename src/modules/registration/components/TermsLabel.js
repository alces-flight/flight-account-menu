import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import silenceEvents from '../../../utils/silenceEvents';

import * as actions from '../actions';

const TermsLabel = ({ onShowPrivacyPolicy, onShowTerms }) => (
  <span>
    I agree to the{' '}
    <a
      href="#"
      onClick={onShowTerms}
    >
      Terms of Service
    </a>
    {' '}and{' '}
    <a
      href="#"
      onClick={onShowPrivacyPolicy}
    >
      Privacy Policy
    </a>.
  </span>
);

TermsLabel.propTypes = {
  onShowPrivacyPolicy: PropTypes.func.isRequired,
  onShowTerms: PropTypes.func.isRequired,
};

export default connect(null, {
  onShowPrivacyPolicy: silenceEvents(actions.showPrivacyPolicyModal),
  onShowTerms: silenceEvents(actions.showTermsModal),
})(TermsLabel);
