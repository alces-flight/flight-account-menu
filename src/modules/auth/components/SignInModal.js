import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';
import SubmitButton from '../../../components/ReduxFormSubmitButton';

import * as actions from '../actions';
import SignInForm from './SignInForm';
import { signOnStateSelector } from "../selectors";
import { signOnStates } from "../constants";

const modalIsDisplayed = (stage) => stage !== signOnStates.NOT_STARTED;

const VerticalDivider = styled(Col)`
  border-right: 1px solid #e3e3e3;
`;

const SignInModal = ({
  hideLoginForm,
  login,
  signOnState,
  startAccountRecovery,
  startSignUp,
}) => (
  <StandardModal
    buttons={(
      <SubmitButton
        color="success"
        form="signIn"
        submittingText="Signing in..."
      >
        Sign in
      </SubmitButton>
    )}
    closeButtonText="Cancel"
    isOpen={modalIsDisplayed(signOnState)}
    size="lg"
    title="Sign in to Flight"
    toggle={hideLoginForm}
  >
    <Row>
      <VerticalDivider md={8}>
        <SignInForm onSubmit={login} />
      </VerticalDivider>
      <Col md={4}>
        <p className="text-muted">
          Don&rsquo;t have an account yet?{' '}
          <Button
            color="link"
            onClick={() => {hideLoginForm() ; startSignUp();}}
            style={{ padding: 0, paddingBottom: '0.25rem' }}
            tabIndex={1}
          >
            Sign up
          </Button>
        </p>
        <p className="text-muted">
          Forgot your password?{' '}
          <Button
            color="link"
            onClick={() => {hideLoginForm(); startAccountRecovery();}}
            style={{ padding: 0, paddingBottom: '0.25rem' }}
            tabIndex={1}
          >
            Start recovering your account
          </Button>
        </p>
      </Col>
    </Row>
  </StandardModal>
);

SignInModal.propTypes = {
  hideLoginForm: PropTypes.func,
  login: PropTypes.func,
  signOnState: PropTypes.number,
  startAccountRecovery: PropTypes.func.isRequired,
  startSignUp: PropTypes.func.isRequired,
};

export default connect(
  createStructuredSelector({
    signOnState: signOnStateSelector
  }),
  {
    login: actions.login,
    hideLoginForm: actions.hideLoginForm,
  }
)(SignInModal);
