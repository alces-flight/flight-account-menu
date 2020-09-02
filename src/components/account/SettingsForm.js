import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../../modules/auth'; 

const SettingsForm = ({
  // handleSubmit,
  // invalid,
  // pristine,
  // submitFailed,
  // submitting,
  // user,
  errors,
  handleInputChange,
  handleSubmit,
  inputs,
  touched,
  unexpectedFailure,
}) => (
  <form onSubmit={handleSubmit}>
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
      input={{
        onChange: handleInputChange,
        value: inputs.username,
      }}
      meta={{
        error: errors.username,
        touched: touched.username,
      }}
    />
    <FormInput
      label="Email address"
      name="email"
      type="email"
      input={{
        onChange: handleInputChange,
        value: inputs.email,
      }}
      meta={{
        error: errors.email,
        touched: touched.email,
      }}
    />
    <CollapsibleFormSection
      input={{
        onChange: handleInputChange,
        value: inputs.changingPassword,
      }}
    >
      <FormInput
        label="Enter your current password"
        name="currentPassword"
        type="password"
        input={{
          onChange: handleInputChange,
          value: inputs.currentPassword,
        }}
        meta={{
          error: errors.currentPassword,
          touched: touched.currentPassword,
        }}
      />
      <FormInput
        label="Enter your new password"
        minLength={6}
        name="password"
        userInputs={[ user.email, user.username ]}
        validator={conditionalPasswordValidator}
        input={{
          onChange: handleInputChange,
          value: inputs.password,
        }}
        meta={{
          error: errors.password,
          touched: touched.password,
        }}
      />
      <FormInput
        label="Confirm your new password"
        name="passwordConfirmation"
        type="password"
        input={{
          onChange: handleInputChange,
          value: inputs.passwordConfirmation,
        }}
        meta={{
          error: errors.passwordConfirmation,
          touched: touched.passwordConfirmation,
        }}
      />
    </CollapsibleFormSection>
  </form>
);

const enhance = a => a;
// const enhance = compose(
//   connect(
//     (state) => {
//       const user = auth.selectors.currentUserSelector(state);
//       if (user == null) {
//         return {
//           initialValues: {
//             changingPassword: false
//           },
//         };
//       }
//       return {
//         initialValues: {
//           changingPassword: false,
//           username: user.username,
//           email: user.email,
//         },
//         user: user,
//       };
//     },
//   ),
// );

export default enhance(SettingsForm);
