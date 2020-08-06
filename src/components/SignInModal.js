import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from './StandardModal';
import StatefulButton from './StatefulButton';
import auth from '../modules/auth';
import useForm from '../useForm';

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
          <label htmlFor="login">
            Enter your Flight username or email address:
          </label>
          <input
            className="form-control"
            id="login"
            name="login"
            onChange={handleInputChange}
            required
            type="text"
            value={inputs.login == null ? "" : inputs.login}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Enter your password:
          </label>
          <input
            className="form-control"
            id="password"
            name="password"
            onChange={handleInputChange}
            required
            type="password"
            value={inputs.password == null ? "" : inputs.password}
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
