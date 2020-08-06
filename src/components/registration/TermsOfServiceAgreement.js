import React from 'react';
import { FormGroup } from 'reactstrap';

import FormInput from '../FormInput';
import TermsLabel from './TermsLabel';

const TermsOfServiceAgreement = ({ handleInputChange, inputs }) => (
  <FormGroup check>
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
  </FormGroup>
);

export default TermsOfServiceAgreement;
