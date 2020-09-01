import React from 'react';

import FormInput from '../FormInput';
import TermsLabel from './TermsLabel';

const TermsOfServiceAgreement = ({ handleInputChange, inputs }) => (
  <FormInput
    check
    name='terms'
    label={<TermsLabel />}
    type='checkbox'
    input={{
      onChange: handleInputChange,
      value: inputs.terms,
    }}
  />
);

export default TermsOfServiceAgreement;
