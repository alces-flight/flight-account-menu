import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useForm } from 'react-hook-form';

import auth from '../../modules/auth'; 

import FormInput from '../FormInput';
import { resolver, settingErrors } from "../../utils/formValidationResolver";

const ConfirmPasswordForm = ({
  rawConfirmPassword,
  user,
}, apiRef) => {
  
  const { register, handleSubmit, errors, formState, setError } = useForm({
    mode: 'all',
    resolver: resolver(auth.validations.confirmPasswordValidator),
  });
  const { touched, isSubmitted } = formState;
  const confirmPassword = (data) => rawConfirmPassword(data, user)
  const submit = handleSubmit(settingErrors(confirmPassword, setError));

  // API exported by this component to allow for programatic submitting.
  // This is so not the way React functional components are supposed to work,
  // but it does work.
  apiRef.current = {
    submit: submit,
  };

  return (
    <form onSubmit={submit}>
      {/* 
        submitFailed
        ? <p className='text-warning'>Please correct the errors below and try again.</p>
        : null
      */}
      <FormInput
        label="Enter your password"
        name="password"
        type="password"
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
      user: auth.selectors.currentUserSelector,
    }),
    {
      rawConfirmPassword: auth.actions.confirmPassword
    },
    null,
    { forwardRef: true },
  ),
  React.forwardRef,
);

export default enhance(ConfirmPasswordForm);
