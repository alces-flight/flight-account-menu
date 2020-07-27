import React from 'react';
import { Field } from 'redux-form';
import { FormGroup } from 'reactstrap';

import FormInput from '../../../components/FormInput';

import TermsLabel from './TermsLabel';

const TermsOfServiceAgreement = () => (
  <FormGroup check>
    <Field
      check
      component={FormInput}
      id='terms'
      label={<TermsLabel />}
      name='terms'
      type='checkbox'
    />
  </FormGroup>
);

export default TermsOfServiceAgreement;
