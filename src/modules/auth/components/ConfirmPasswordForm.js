import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import {
  Form,
  FormGroup
} from 'reactstrap';
import {
  Field,
  propTypes as formPropTypes,
  reduxForm,
} from 'redux-form';

import HiddenButton from '../../../components/HiddenButton';
import FormInput from '../../../components/FormInput';

import { confirmPasswordValidator } from '../validations';
import * as selectors from '../selectors';
import * as actions from '../actions';

const ConfirmPasswordForm = ({
  handleSubmit,
  invalid,
  pristine,
  submitting,
  submitFailed,
}) => (
  <Form onSubmit={handleSubmit}>
    { 
      submitFailed
        ? <p className='text-warning'>Please correct the errors below and try again.</p>
        : null
    }
    <FormGroup>
      <Field
        component={FormInput}
        id='password'
        label='Enter your password'
        name='password'
        type='password'
      />
    </FormGroup>
    <HiddenButton
      disabled={submitting || invalid || pristine}
      type='submit'
    >
      Sign in
    </HiddenButton>
  </Form>
);

ConfirmPasswordForm.propTypes = {
  ...formPropTypes
};

const enhance = compose(
  connect(createStructuredSelector({
    user: selectors.currentUserSelector,
  })),

  reduxForm({
    destroyOnUnmount: false,
    form: 'confirmPassword',
    onSubmit: (values, dispatch, { user }) => {
      return dispatch(actions.confirmPassword(values, user));
    },
    validate: confirmPasswordValidator,
  })
);

export default enhance(ConfirmPasswordForm);

