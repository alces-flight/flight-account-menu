import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';

import auth from '../../modules/auth';
import registration from '../../modules/registration';

import FormInput from '../FormInput';
import { resolver, settingErrors } from "../../utils/formValidationResolver";

function Form({ login, }, apiRef) {
  const { register, handleSubmit, errors, formState, setError } = useForm({
    mode: 'all',
    resolver: resolver(auth.validations.signInValidator),
  });
  const { touched, isSubmitted, isSubmitting } = formState;
  const submit = handleSubmit(settingErrors(login, setError));

  // API exported by this component to allow for programatic submitting.
  // This is so not the way React functional components are supposed to work,
  // but it does work.
  apiRef.current = {
    submit: submit,
    isSubmitting: isSubmitting,
  };

  return (
    <form onSubmit={submit}>
      <FormInput
        label="Enter your Flight username or email address"
        name="login"
        type="text"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />
      <FormInput
        label="Enter your password"
        name="password"
        type="password"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />
      <FormInput
        check
        help="Don't choose this on a shared or public computer"
        label="Remember me"
        name="permanent"
        type="checkbox"
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
    null,
    {
      login: auth.actions.login,
    },
    null,
    { forwardRef: true },
  ),
  React.forwardRef,
);

export default enhance(Form);
