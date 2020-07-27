import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Row, Col } from 'reactstrap';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import StandardModal from '../../../components/StandardModal';
import SubmitButton from '../../../components/ReduxFormSubmitButton';

import * as actions from '../actions';
import RegistrationForm from './RegistrationForm';
import { registrationStages } from "../constants";
import * as selectors from "../selectors";

const modalIsDisplayed = (stage) => stage !== registrationStages.NOT_STARTED;

const VerticalDivider = styled(Col)`
  border-right: 1px solid #e3e3e3;
`;

const RegistrationModal = ({
  cancelSignUp,
  emailFromUrl,
  register,
  registrationStage,
  showLoginForm,
  ...props,
}) => {
  const submitButton = (
    <SubmitButton
      color="success"
      form="registration"
      submittingText="Signing up..."
    >
      Sign up
    </SubmitButton>
  );

  return (
    <StandardModal
      buttons={submitButton}
      closeButtonText="Cancel"
      isOpen={modalIsDisplayed(registrationStage)}
      size="lg"
      title="Sign up to the Alces Flight Platform"
      toggle={cancelSignUp}
    >
      <Row>
        <VerticalDivider md={8}>
          <RegistrationForm
            initialValues={{
              email: emailFromUrl,
            }}
            onSubmit={register}
          />
        </VerticalDivider>
        <Col md={4}>
          <p className="text-muted">
            Already have an account?{' '}
            <Button
              className='p-0'
              color="link"
              onClick={() => {cancelSignUp() ; showLoginForm();}}
              tabIndex={1}
            >
              Sign in
            </Button>
          </p>
        </Col>
      </Row>
    </StandardModal>
  );
};

RegistrationModal.propTypes = {
  cancelSignUp: PropTypes.func.isRequired,
  emailFromUrl: PropTypes.string,
  register: PropTypes.func,
  registrationStage: PropTypes.number.isRequired,
  showLoginForm: PropTypes.func.isRequired,
};

const enhance = compose(
  connect(
    createStructuredSelector({
      emailFromUrl: selectors.signupEmailFromUrl,
      registrationStage: selectors.registrationState,
    }),
    {
      cancelSignUp: actions.cancelSignUp,
      register: actions.register,
      startSignUp: actions.startSignUp,
    }
  ),

  lifecycle({
    componentDidMount: function componentDidMount() {
      if (this.props.emailFromUrl) {
        this.props.startSignUp();
      }
    },
  }),
);

export default enhance(RegistrationModal);
