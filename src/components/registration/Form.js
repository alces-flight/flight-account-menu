import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useForm } from 'react-hook-form';

import account from '../../modules/account';
import registration from '../../modules/registration'; 

import FormInput from '../FormInput';
import TermsLabel from './TermsLabel';
import { resolver, settingErrors } from "../../utils/formValidationResolver";

const UnexpectedFailureMessage = () => (
  <p className="text-warning">
    Unfortunately, there was an unexpected error while attempting to register
    your account.  Please check your settings and try again. If the issue
    continues, please let us know by sending an email to <a href="mailto:info@alces-flight.com">info@alces-flight.com</a>.
  </p>
);

function RegistrationForm({
  registerAccount,
  unexpectedFailure,
}, apiRef) {
  const { register, handleSubmit, errors, formState, setError } = useForm({
    mode: 'all',
    resolver: resolver(account.validations.registrationValidator),
  });
  const { touched, isSubmitted, isSubmitting } = formState;
  const submit = handleSubmit(settingErrors(registerAccount, setError));

  // API exported by this component to allow for programatic submitting.
  // This is so not the way React functional components are supposed to work,
  // but it does work.
  apiRef.current = {
    submit: submit,
    isSubmitting: isSubmitting,
  };

  return (
    <form onSubmit={submit}>
      { unexpectedFailure ? <UnexpectedFailureMessage /> : null }
      <FormInput
        label="Pick a username"
        name="username"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />
      <FormInput
        name="email"
        label="Enter your email address"
        type="email"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />
      {/* XXX Add zxcvbn validation */}
      <FormInput
        label="Choose a password (6 or more characters)"
        minLength={6}
        name="password"
        type="password"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />
      <FormInput
        name="passwordConfirmation"
        label="Confirm password"
        type="password"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />

      <FormInput
        check
        name='terms'
        label={<TermsLabel />}
        type='checkbox'
        ref={register}
        formErrors={errors}
        formMeta={formState}
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
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />

      <button type="submit" className="d-none"></button>
    </form>
  );
}

const enhance = compose(
  connect(
    createStructuredSelector({
      unexpectedFailure: registration.selectors.unexpectedFailure,
    }),
    {
      registerAccount: registration.actions.register,
    },
    null,
    { forwardRef: true },
  ),
  React.forwardRef,
);

export default enhance(RegistrationForm);
