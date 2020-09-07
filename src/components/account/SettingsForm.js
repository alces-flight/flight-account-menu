import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useForm } from 'react-hook-form';

import auth from '../../modules/auth'; 
import account from '../../modules/account'; 

import CollapsibleFormSection from '../CollapsibleFormSection';
import FormInput from '../FormInput';
import { resolver, settingErrors } from "../../utils/formValidationResolver";

const SettingsForm = ({
  initialValues,
  baseUpdateAccount,
  user,
}, apiRef) => {
  const [changingPassword, setChangingPassword] = useState(initialValues.changingPassword);

  const { register, handleSubmit, errors, formState, setError } = useForm({
    defaultValues: initialValues,
    mode: 'all',
    resolver: resolver((data) => {
      return account.validations.validator({...data, changingPassword: changingPassword});
    }),
  });
  const { touched, isSubmitted } = formState;
  const updateAccount = (data) => (
    baseUpdateAccount({...data, changingPassword: changingPassword})
  )
  const submit = handleSubmit(settingErrors(updateAccount, setError));

  // API exported by this component to allow for programatic submitting.
  // This is so not the way React functional components are supposed to work,
  // but it does work.
  apiRef.current = {
    submit: submit,
  };

  return (
    <form onSubmit={submit}>
      <button type="submit" className="d-none"></button>
      {/*
      submitFailed ? (
        <p className='text-warning'>
          Please correct the errors below and try again.
        </p>
      ) : null
      */}
      <FormInput
        label="User name"
        name="username"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />
      <FormInput
        label="Email address"
        name="email"
        type="email"
        ref={register}
        formErrors={errors}
        formMeta={formState}
      />
      <CollapsibleFormSection
        name="changinPassword"
        isOpen={changingPassword}
        toggle={() => setChangingPassword(!changingPassword)}
      >
        <FormInput
          label="Enter your current password"
          name="currentPassword"
          type="password"
          ref={register}
          formErrors={errors}
          formMeta={formState}
        />
        <FormInput
          label="Enter your new password"
          minLength={6}
          name="password"
          type="password"
          ref={register}
          formErrors={errors}
          formMeta={formState}
          // userInputs={[ user.email, user.username ]}
          // validator={conditionalPasswordValidator}
        />
        <FormInput
          label="Confirm your new password"
          name="passwordConfirmation"
          type="password"
          ref={register}
          formErrors={errors}
          formMeta={formState}
        />
      </CollapsibleFormSection>
    </form>
  );
}

const enhance = compose(
  connect(
    (state) => {
      const user = auth.selectors.currentUserSelector(state);
      if (user == null) {
        return {
          initialValues: {
            changingPassword: false
          },
        };
      }
      return {
        initialValues: {
          changingPassword: false,
          username: user.username,
          email: user.email,
        },
        user: user,
      };
    },
    {
      baseUpdateAccount: account.actions.update,
    },
    null,
    { forwardRef: true },
  ),
  React.forwardRef,
);

export default enhance(SettingsForm);
