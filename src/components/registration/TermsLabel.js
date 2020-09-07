import React, { useContext } from 'react';

import { Context as ConfigContext } from '../../ConfigContext';

const TermsLabel = () => {
  const { termsUrl, privacyPolicyUrl } = useContext(ConfigContext);

  return (
    <span>
      I agree to the{' '}
      <a
        href={termsUrl || "/terms"}
        rel="noopener noreferrer"
        target="_blank"
      >
        Terms of Service
      </a>
      {' '}and{' '}
      <a
        href={privacyPolicyUrl || "/privacy"}
        rel="noopener noreferrer"
        target="_blank"
      >
        Privacy Policy
      </a>.
    </span>
  );
}

export default TermsLabel;
