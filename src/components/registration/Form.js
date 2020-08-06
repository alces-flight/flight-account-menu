import React from 'react';

import FormInput from '../FormInput';
import TermsOfServiceAgreement from './TermsOfServiceAgreement';

function RegistrationForm({ handleSubmit, handleInputChange, inputs }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <FormInput
          label="Pick a username"
          name="username"
          input={{
            onChange: handleInputChange,
            value: inputs.username,
          }}
          required
        />
      </div>
      <div className="form-group">
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
      </div>
      <div className="form-group">
        {/* XXX Add zxcvbn validation */}
        <FormInput
          label="Choose a password (6 or more characters)"
          minLength={6}
          name="password"
          required
          type="password"
          userInputs={[ inputs.email, inputs.username ]}
          input={{
            onChange: handleInputChange,
            value: inputs.password,
          }}
        />
      </div>
      <div className="form-group">
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
      </div>

      <TermsOfServiceAgreement
        handleInputChange={handleInputChange}
        inputs={inputs}
      />

      <div class="form-group form-check">
      </div>


      <button type="submit" className="d-none"></button>
    </form>
  );
}

export default RegistrationForm;
