import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import auth from '../../modules/auth';
import registration from '../../modules/registration';

import StandardModal from '../StandardModal';
import StatefulButton from '../StatefulButton';
import useForm from '../../useForm';
import FormInput from '../FormInput';

const modalIsDisplayed = (stage) => stage !== auth.constants.signOnStates.NOT_STARTED;
const isSubmitting = (stage) => stage === auth.constants.signOnStates.SUBMITTING;

function SignInModal({
  hideLoginForm,
  login,
  signOnState,
  startSignUp,
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
        <FormInput
          label="Enter your Flight username or email address"
          name="login"
          type="text"
          input={{
            onChange: handleInputChange,
            value: inputs.login,
          }}
        />
        <FormInput
          label="Enter your password"
          name="password"
          type="password"
          input={{
            onChange: handleInputChange,
            value: inputs.password,
          }}
        />
        <FormInput
          check
          help="Don't choose this on a shared or public computer"
          label="Remember me"
          name="permanent"
          type="checkbox"
          input={{
            onChange: handleInputChange,
            value: inputs.permanent,
          }}
        />
        <button type="submit" className="d-none"></button>
      </form>

      <hr/>
      <span className="text-muted">
        Don&rsquo;t have an account yet?{' '}
      </span>
      <button
        className="btn btn-link p-0 pb-1"
        onClick={() => {hideLoginForm() ; startSignUp();}}
        tabIndex={1}
      >
        Sign up
      </button>

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
    startSignUp: registration.actions.startSignUp,
  }
)(SignInModal);
