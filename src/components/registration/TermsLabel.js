import React from 'react';
import { connect } from 'react-redux';

import silenceEvents from '../../utils/silenceEvents';
import registration from '../../modules/registration'; 

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

export default connect(null, {
  onShowPrivacyPolicy: silenceEvents(registration.actions.showPrivacyPolicyModal),
  onShowTerms: silenceEvents(registration.actions.showTermsModal),
})(TermsLabel);
