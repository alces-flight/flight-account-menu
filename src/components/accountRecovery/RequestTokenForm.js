import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useForm } from 'react-hook-form';

import accountRecovery from '../../modules/accountRecovery';

import FormInput from '../FormInput';
import { resolver } from "../../utils/formValidationResolver";

const RequestTokenForm = ({
  requestToken,
  stage,
}, apiRef) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'all',
    resolver: resolver(accountRecovery.validations.requestTokenValidator),
  });
  const { touched, isSubmitted } = formState;
  const submit = handleSubmit(requestToken);

  // API exported by this component to allow for programatic submitting.
  // This is so not the way React functional components are supposed to work,
  // but it does work.
  apiRef.current = { submit: submit };

  return (
    <div>
      <p>
        Enter your email address and select "Recover" to proceed with the
        recovery of your Alces Flight Platform account.
      </p>
      <form onSubmit={submit}>
        {
          stage === 'REJECTED' ? (
            <p className="text-warning">
              Please correct the errors below and try again.
            </p>
          ) : null
        }
        <FormInput
          label="Enter your email address"
          name="email"
          type="email"
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
      requestToken: accountRecovery.actions.requestToken,
    },
    null,
    { forwardRef: true },
  ),
  React.forwardRef,
);

export default enhance(RequestTokenForm);
