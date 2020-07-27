import React from 'react';

import {
  Form,
  FormGroup
} from 'reactstrap';

import {
  Field,
  formValueSelector,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import account from '../../account';
import FormInput from '../../../components/FormInput';
import HiddenButton from '../../../components/HiddenButton';

import { registrationValidator } from '../validations';
import * as selectors from '../selectors';
import TermsOfServiceAgreement from './TermsOfServiceAgreement';

const UnexpectedFailureMessage = () => (
  <p className="text-warning">
    Unfortunately, there was an unexpected error while attempting to register
    your account.  Please check your settings and try again. If the issue
    continues, please let us know by sending an email to <a href="mailto:info@alces-flight.com">info@alces-flight.com</a>.
  </p>
);

const RegistrationForm = ({
  email,
  handleSubmit,
  invalid,
  pristine,
  submitFailed,
  submitting,
  unexpectedFailure,
  username,
}) => (
  <Form onSubmit={handleSubmit}>
    {
      submitFailed
        ? <p className='text-warning'>Please correct the errors below and try again.</p>
        : null
    }
    { unexpectedFailure ? <UnexpectedFailureMessage /> : null }
    <FormGroup>
      <Field
        component={FormInput}
        id='username'
        label='Pick a username'
        name='username'
        type='text'
      />
    </FormGroup>
    <FormGroup>
      <Field
        component={FormInput}
        id='email'
        label='Enter your email address'
        name='email'
        type='email'
      />
    </FormGroup>
    <FormGroup>
      <account.PasswordField
        id='password'
        label='Choose a password (6 or more characters)'
        minLength={6}
        name='password'
        userInputs={[ email, username ]}
      />
    </FormGroup>
    <FormGroup>
      <Field
        component={FormInput}
        id="passwordConfirmation"
        label="Confirm password"
        name="passwordConfirmation"
        type="password"
      />
    </FormGroup>
    <TermsOfServiceAgreement />
    <FormGroup check>
      <Field
        check
        component={FormInput}
        help="The information you provide may be used to keep you informed
        about our future products and events."
        id='optedIntoMarketing'
        label={<span>
          I wish to receive marketing information from Alces Flight.
        </span>}
        name='optedIntoMarketing'
        type='checkbox'
      />
    </FormGroup>
    <HiddenButton
      disabled={submitting || invalid || pristine}
      type='submit'
    >
      Sign in
    </HiddenButton>
  </Form>
);

RegistrationForm.propTypes = {
  ...formPropTypes
};

const form = 'registration';
const selector = formValueSelector(form);
const enhance = compose(
  connect((state) => {
    const { email, username } = selector(state, 'email', 'username');
    const unexpectedFailure = selectors.unexpectedFailure(state);
    return {
      email,
      unexpectedFailure,
      username,
    };
  }),

  reduxForm({
    destroyOnUnmount: false,
    form: form,
    validate: registrationValidator
  })
);

export default enhance(RegistrationForm);
