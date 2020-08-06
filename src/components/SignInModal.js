import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from './StandardModal';
import StatefulButton from './StatefulButton';
import auth from '../modules/auth';
import useForm from '../useForm';
import FormInput from './FormInput';

const modalIsDisplayed = (stage) => stage !== auth.constants.signOnStates.NOT_STARTED;
const isSubmitting = (stage) => stage === auth.constants.signOnStates.SUBMITTING;

function SignInModal({
  hideLoginForm,
  login,
  signOnState,
}) {
  const { handleSubmit, handleInputChange, inputs } = useForm(login);

  return (
    <StandardModal
      buttons={(
        <StatefulButton
          className="btn btn-primary"
          submitting={isSubmitting(signOnState)}
          onClick={handleSubmit}
          style={{ minWidth: '52px' }}
          type="submit"
        >
          Sign in
        </StatefulButton>
      )}
      closeButtonText="Cancel"
      isOpen={modalIsDisplayed(signOnState)}
      title="Sign in to Flight"
      toggle={hideLoginForm}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <FormInput
            label="Enter your Flight username or email address"
            name="login"
            type="text"
            input={{
              onChange: handleInputChange,
              value: inputs.login,
            }}
          />
        </div>
        <div className="form-group">
          <FormInput
            label="Enter your password"
            name="password"
            type="password"
            input={{
              onChange: handleInputChange,
              value: inputs.password,
            }}
          />
        </div>
        <button type="submit" className="d-none"></button>
      </form>
    </StandardModal>
  );
}

export default connect(
  createStructuredSelector({
    signOnState: auth.selectors.signOnStateSelector
  }),
  {
    login: auth.actions.login,
    hideLoginForm: auth.actions.hideLoginForm,
  }
)(SignInModal);
