import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useForm } from 'react-hook-form';

import accountRecovery from '../../modules/accountRecovery';
import account from '../../modules/account';

import FormInput from '../FormInput';
import { resolver } from "../../utils/formValidationResolver";

const ResetPasswordForm = ({
  resetPassword,
  stage,
  token,
}, apiRef) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'all',
    resolver: resolver(accountRecovery.validations.resetPasswordValidator),
  });
  const { touched, isSubmitted } = formState;
  const submit = handleSubmit((data) => resetPassword({...data, token: token }));

  // API exported by this component to allow for programatic submitting.
  // This is so not the way React functional components are supposed to work,
  // but it does work.
  apiRef.current = { submit: submit };

  return (
    <div>
      <p>
        To complete the recovery of your account, please choose your new
        password and then select "Recover".
      </p>
      <form onSubmit={submit}>
        {
          stage === 'REJECTED' ? (
            <p className="text-warning">
              Please correct the errors below and try again.
            </p>
          ) : null
        }
        {/* XXX Add zxcvbn validation */}
        <FormInput
          label="Enter your new password"
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
        <button type="submit" className="d-none"></button>
      </form>
    </div>
  );
}

const enhance = compose(
  connect(
    createStructuredSelector({
      stage: accountRecovery.selectors.requestToken.stage,
    }),
    {
      resetPassword: accountRecovery.actions.resetPassword,
    },
    null,
    { forwardRef: true },
  ),
  React.forwardRef,
);

export default enhance(ResetPasswordForm);
