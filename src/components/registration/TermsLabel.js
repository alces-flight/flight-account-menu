import React from 'react';

const TermsLabel = () => (
  <span>
    I agree to the{' '}
    <a
      href="/terms"
      rel="noopener noreferrer"
      target="_blank"
    >
      Terms of Service
    </a>
    {' '}and{' '}
    <a
      href="/privacy"
      rel="noopener noreferrer"
      target="_blank"
    >
      Privacy Policy
    </a>.
  </span>
);

export default TermsLabel;
