import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import registration from '../../modules/registration'; 

import FormInput from '../FormInput';
import TermsOfServiceAgreement from './TermsOfServiceAgreement';

const UnexpectedFailureMessage = () => (
  <p className="text-warning">
    Unfortunately, there was an unexpected error while attempting to register
    your account.  Please check your settings and try again. If the issue
    continues, please let us know by sending an email to <a href="mailto:info@alces-flight.com">info@alces-flight.com</a>.
  </p>
);

function RegistrationForm({
  errors,
  handleInputChange,
  handleSubmit,
  inputs,
  touched,
  unexpectedFailure,
}) {
  return (
    <form onSubmit={handleSubmit}>
      { unexpectedFailure ? <UnexpectedFailureMessage /> : null }
      <FormInput
        label="Pick a username"
        name="username"
        input={{
          onChange: handleInputChange,
          value: inputs.username,
        }}
        required
      />
      <FormInput
        name="email"
        label="Enter your email address"
        type="email"
        required
        input={{
          onChange: handleInputChange,
          value: inputs.email,
        }}
      />
      {/* XXX Add zxcvbn validation */}
      <FormInput
        label="Choose a password (6 or more characters)"
        minLength={6}
        name="password"
        required
        type="password"
        // userInputs={[ inputs.email, inputs.username ]}
        input={{
          onChange: handleInputChange,
          value: inputs.password,
        }}
      />
      <FormInput
        name="passwordConfirmation"
        label="Confirm password"
        type="password"
        required
        input={{
          onChange: handleInputChange,
          value: inputs.passwordConfirmation,
        }}
      />

      <TermsOfServiceAgreement
        handleInputChange={handleInputChange}
        inputs={inputs}
      />

      <FormInput
        check
        help="The information you provide may be used to keep you informed
        about our future products and events."
        label={<span>
          I wish to receive marketing information from Alces Flight.
        </span>}
        name='optedIntoMarketing'
        type='checkbox'
        input={{
          onChange: handleInputChange,
          value: inputs.optedIntoMarketing,
        }}
        meta={{
          error: errors.optedIntoMarketing,
          touched: touched.optedIntoMarketing,
        }}
      />

      <button type="submit" className="d-none"></button>
    </form>
  );
}

const enhance = connect(
  createStructuredSelector({
    unexpectedFailure: registration.selectors.unexpectedFailure,
  }),
);

export default enhance(RegistrationForm);
